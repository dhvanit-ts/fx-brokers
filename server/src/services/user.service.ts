import { env } from "../conf/env";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Admin from "../models/admin.model";

class UserService {
  options: null | {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax";
    domain: string;
  } = null;
  accessTokenExpiry = 60 * 1000 * parseInt(env.ACCESS_TOKEN_EXPIRY || "0"); // In minutes
  refreshTokenExpiry =
    60 * 60 * 1000 * 24 * parseInt(env.REFRESH_TOKEN_EXPIRY || "0"); // In days
  adminAccessTokenExpiry =
    60 * 1000 * parseInt(env.ADMIN_ACCESS_TOKEN_EXPIRY || "0"); // In minutes

  constructor() {
    this.options = {
      httpOnly: true,
      secure: env.ENVIRONMENT === "production",
      domain:
        env.ENVIRONMENT === "production"
          ? env.ACCESS_CONTROL_ORIGIN || "localhost"
          : "localhost",
      sameSite:
        env.ENVIRONMENT === "production"
          ? ("none" as "none")
          : ("lax" as "lax"),
    };
  }

  generateAccessToken(id: number, username: string, isAdmin: boolean) {
    const secret = isAdmin ? env.ADMIN_ACCESS_TOKEN_SECRET : env.ACCESS_TOKEN_SECRET
    return jwt.sign(
      {
        id,
        username,
      },
      secret,
      {
        expiresIn: `${parseInt(
          isAdmin
            ? env.ADMIN_ACCESS_TOKEN_EXPIRY
            : env.ACCESS_TOKEN_EXPIRY || "0"
        )}m`,
      }
    );
  }

  generateRefreshToken(id: number, username: string) {
    return jwt.sign(
      {
        id,
        username,
      },
      env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: `${parseInt(env.REFRESH_TOKEN_EXPIRY || "0")}d`,
      }
    );
  }

  async generateAccessAndRefreshToken(
    userId: number,
    isAdmin: boolean = false
  ) {
    try {
      let user = null;
      if (isAdmin) {
        user = await Admin.findOne({
          where: { id: userId },
        });
      } else {
        user = await User.findOne({
          where: { id: userId },
        });
      }

      if (!user) throw new ApiError(404, "User not found");

      const accessToken = this.generateAccessToken(
        user.dataValues.id,
        user.dataValues.username,
        isAdmin
      );
      const refreshToken = this.generateRefreshToken(user.dataValues.id, user.username);

      const refreshTokenUpdate = {
        refreshToken: refreshToken,
      };
      const whereClauseUpdate = {
        where: { id: user.dataValues.id },
      };

      if (isAdmin) {
        await Admin.update(refreshTokenUpdate, whereClauseUpdate);
      } else {
        await User.update(refreshTokenUpdate, whereClauseUpdate);
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw new ApiError(
        500,
        "Something went wrong while generating access and refresh token"
      );
    }
  }
}

export default UserService;
