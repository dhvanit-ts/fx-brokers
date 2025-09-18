import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { hashOTP } from "../utils/cryptographer";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import handleError from "../utils/HandleError";
import UserService from "../services/user.service";
import { env } from "../conf/env";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import nodeCache from "../services/cache.service";
import { Op } from "sequelize";
import axios from "axios";

const userService = new UserService();

export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code;

  try {
    // 🔄 Exchange code for tokens
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: env.GOOGLE_OAUTH_CLIENT_ID,
          client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
          redirect_uri: `${env.SERVER_BASE_URI}/api/v1/users/google/callback`,
          grant_type: "authorization_code",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = data;

    // 🙋 Get user info
    const userInfoRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const user = userInfoRes.data;

    const existingUser = await User.findOne({
      where: { email: user.email.toLowerCase() },
    });

    if (existingUser) {
      const { accessToken, refreshToken } =
        await userService.generateAccessAndRefreshToken(
          existingUser.dataValues.id
        );

      return res
        .status(200)
        .cookie("__accessToken", accessToken, {
          ...userService.options,
          maxAge: userService.accessTokenExpiry,
        })
        .cookie("__refreshToken", refreshToken, {
          ...userService.options,
          maxAge: userService.refreshTokenExpiry,
        })
        .redirect(env.ACCESS_CONTROL_ORIGIN);
    }

    res.redirect(
      `${env.ACCESS_CONTROL_ORIGIN}/auth/oauth/callback?email=${user.email}`
    );
  } catch (err) {
    handleError(
      err as ApiError,
      res,
      "Failed to login with Google",
      "GOOGLE_LOGIN_ERROR"
    );
  }
};

export const handleUserOAuth = async (req: Request, res: Response) => {
  try {
    const { email, username } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const createdUser = await User.create(
      {
        email,
        username,
        display_name: username,
        password: null,
        auth_type: "oauth",
      },
      {
        returning: true,
      }
    );

    if (!createdUser) throw new ApiError(500, "Failed to create user");

    const { accessToken, refreshToken } =
      await userService.generateAccessAndRefreshToken(
        createdUser.dataValues.id
      );

    if (!accessToken || !refreshToken) {
      res
        .status(500)
        .json({ error: "Failed to generate access and refresh token" });
      return;
    }

    res
      .status(201)
      .cookie("__accessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
      })
      .cookie("__refreshToken", refreshToken, {
        ...userService.options,
        maxAge: userService.refreshTokenExpiry,
      })
      .json({
        message: "Form submitted successfully!",
        data: {
          ...createdUser,
          refreshToken: null,
          password: null,
          email: null,
        },
      });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to register user",
      "REGISTER_USER_ERROR"
    );
  }
};

export const initializeUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username)
      throw new ApiError(400, "All fields are required");

    const existingUser =
      (await User.findOne({
        where: { email: email },
      })) ?? null;

    if (existingUser)
      throw new ApiError(400, "User with this email already exists");

    const isUsernameUnique = !(await User.findOne({
      where: { username: username },
    }));

    if (!isUsernameUnique) throw new ApiError(400, "Username is already taken");

    const user = {
      password,
      email: email.toLowerCase(),
      username,
    };

    const pendingUserCacheSuccess = nodeCache.set(
      `pending:${email}`,
      user,
      300
    );

    if (!pendingUserCacheSuccess) {
      throw new ApiError(500, "Failed to set user in Redis");
    }

    res.status(201).json({
      message: "User initialized successfully and OTP sent",
      email,
    });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to initialize user",
      "INIT_USER_ERROR"
    );
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = nodeCache.get(`pending:${email}`);
    if (!user) throw new ApiError(400, "User not found");

    const { password, username } = user as {
      password: string;
      username: string;
    };

    const encryptedPassword = await bcrypt.hash(password, 12);

    const createdUser = await User.create(
      {
        email,
        password: encryptedPassword,
        username,
        display_name: username,
        auth_type: "manual",
      },
      {
        returning: true,
      }
    );

    if (!createdUser) {
      res.status(400).json({ error: "Failed to create user" });
      return;
    }

    const { accessToken, refreshToken } =
      await userService.generateAccessAndRefreshToken(
        createdUser.dataValues.id.toString()
      );

    if (!accessToken || !refreshToken) {
      res
        .status(500)
        .json({ error: "Failed to generate access and refresh token" });
      return;
    }

    nodeCache.del(`pending:${email}`);
    nodeCache.del(`otp:${email}`);

    res
      .status(201)
      .cookie("__accessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
      })
      .cookie("__refreshToken", refreshToken, {
        ...userService.options,
        maxAge: userService.refreshTokenExpiry,
      })
      .json({
        message: "Form submitted successfully!",
        data: {
          ...createdUser,
          refreshToken: null,
          password: null,
          email: null,
        },
      });
  } catch (error) {
    console.log(error);
    handleError(
      error as ApiError,
      res,
      "Failed to create a user",
      "USER_REGISTRATION_ERROR"
    );
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      where: { email: email },
    });

    if (!existingUser) throw new ApiError(400, "User not found");
    if (!existingUser.dataValues.password)
      throw new ApiError(400, "Password not found");

    if (!(await bcrypt.compare(password, existingUser.dataValues.password)))
      throw new ApiError(400, "Invalid password");

    const { accessToken, refreshToken } =
      await userService.generateAccessAndRefreshToken(
        existingUser.dataValues.id.toString()
      );

    if (!accessToken || !refreshToken) {
      res
        .status(400)
        .json({ error: "Failed to generate access and refresh token" });
      return;
    }

    res
      .status(200)
      .cookie("__accessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
      })
      .cookie("__refreshToken", refreshToken, {
        ...userService.options,
        maxAge: userService.refreshTokenExpiry,
      })
      .json({
        message: "User logged in successfully!",
        data: {
          ...existingUser,
          refreshToken: null,
          password: null,
          email: null,
        },
      });
  } catch (error) {
    handleError(error as ApiError, res, "Failed to login", "LOGIN_ERROR");
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const user = {
      ...req.user,
      password: null,
      refreshToken: null,
    };

    res
      .status(200)
      .json({ message: "User fetched successfully!", data: user || "" });
  } catch (error) {
    handleError(error, res, "Failed to fetch a user", "GET_USER_ERROR");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) throw new ApiError(400, "User Id is required");

    const user = await User.findByPk(userId);

    if (!user) throw new ApiError(404, "User doesn't exists");

    return res.status(200).json({
      message: "User feteched successfully",
      data: user,
    });
  } catch (error) {
    handleError(error, res, "Failed to fetch a user", "GET_USER_ERROR");
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new ApiError(400, "User not found");
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw new ApiError(400, "User not found");
    }

    user.dataValues.refresh_token = "";

    await User.update(
      {
        refresh_token: JSON.stringify(user.dataValues.refresh_token),
      },
      { where: { id: req.user.id } }
    );

    res
      .status(200)
      .clearCookie("__accessToken", { ...userService.options, maxAge: 0 })
      .clearCookie("__refreshToken", { ...userService.options, maxAge: 0 })
      .json({ message: "User logged out successfully" });
  } catch (error) {
    handleError(error as ApiError, res, "Failed to logout", "LOGOUT_ERROR");
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken =
      req.cookies.__refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken)
      throw new ApiError(401, "Unauthorized request", "UNAUTHORIZED_REQUEST");

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken || typeof decodedToken == "string") {
      throw new ApiError(401, "Invalid Access Token");
    }

    const user = await User.findByPk(decodedToken?.id);

    if (!user || !user.dataValues.refresh_token)
      throw new ApiError(401, "Invalid Refresh Token");

    if (!user.dataValues.refresh_token.includes(incomingRefreshToken)) {
      throw new ApiError(401, "Refresh token is invalid or not recognized");
    }

    const { accessToken, refreshToken } =
      await userService.generateAccessAndRefreshToken(
        user.dataValues.id.toString()
      );

    res
      .status(200)
      .cookie("__accessToken", accessToken, {
        ...userService.options,
        maxAge: userService.accessTokenExpiry,
      })
      .cookie("__refreshToken", refreshToken, {
        ...userService.options,
        maxAge: userService.refreshTokenExpiry,
      })
      .json({ message: "Access token refreshed successfully" });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to refresh access token",
      "REFRESH_ACCESS_TOKEN_ERROR"
    );
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  try {
    const mailResponse = await sendMail(email, "OTP");

    if (!mailResponse.success)
      throw new ApiError(500, mailResponse.error || "Failed to send OTP");
    if (!mailResponse.otpCode) throw new ApiError(500, "Failed to send OTP");

    const hashedOTP = await hashOTP(mailResponse.otpCode);

    const cacheSuccess = nodeCache.set(`otp:${email}`, hashedOTP, 65);

    if (!cacheSuccess) {
      console.error("Failed to set OTP in Redis:", res);
      throw new ApiError(500, "Failed to set OTP in Redis");
    }

    res.status(200).json({
      messageId: mailResponse.messageId,
      message: "OTP sent successfully",
    });
  } catch (error) {
    handleError(error as ApiError, res, "Failed to send OTP", "SEND_OTP_ERROR");
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized request");
    const user = await User.findByPk(req.user.id);
    if (!user) throw new ApiError(404, "User not found");

    const { accent_color, display_name } = req.body;

    const updatedUser = await User.update(
      { accent_color, display_name },
      { where: { id: req.user.id } }
    );

    if (!updatedUser) throw new ApiError(404, "User not found");

    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to update user",
      "UPDATE_USER_ERROR"
    );
  }
};

const OtpVerifier = async (email: string, otp: string) => {
  try {
    const storedOtp = nodeCache.get(`otp:${email}`);

    const hashedOTP = await hashOTP(otp);

    if (storedOtp === hashedOTP) {
      nodeCache.del(`otp:${email}`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    if (!req.body.email || !req.body.otp)
      throw new ApiError(400, "Email and OTP are required");

    const result = await OtpVerifier(req.body.email, req.body.otp);

    if (result) {
      res
        .status(200)
        .json({ message: "OTP verified successfully", isVerified: true });
    } else {
      res.status(400).json({ message: "Invalid OTP", isVerified: false });
    }
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to verify OTP",
      "VERIFY_OTP_ERROR"
    );
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;

    if (!query) throw new ApiError(400, "Query is required");

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: ["id", "username", "email", "accent_color", "display_name"],
    });

    res
      .status(200)
      .json({ message: "Users fetched successfully", results: users });
  } catch (error) {
    handleError(
      error as ApiError,
      res,
      "Failed to search users",
      "SEARCH_USER"
    );
  }
};
