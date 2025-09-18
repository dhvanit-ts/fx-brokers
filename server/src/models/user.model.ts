import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sequelize } from "../db/connect";
import { env } from "../conf/env";

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public authProvider!: string;
  public password!: string | null;
  public refreshToken!: string | null;

  // Instance method: check password
  async isPasswordCorrect(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }

  // Instance method: generate access token
  generateAccessToken(): string {
    return jwt.sign(
      {
        id: this.id,
        username: this.username,
      },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: `${parseInt(env.ACCESS_TOKEN_EXPIRY)}m` }
    );
  }

  // Instance method: generate refresh token
  generateRefreshToken(): string {
    return jwt.sign(
      {
        id: this.id,
      },
      env.REFRESH_TOKEN_SECRET,
      { expiresIn: `${parseInt(env.REFRESH_TOKEN_EXPIRY)}d` }
    );
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "uniq_users_username", // 👈 explicit name
        msg: "Username must be unique",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "uniq_users_email", // 👈 explicit name
        msg: "Email must be unique",
      },
    },
    authProvider: {
      type: DataTypes.ENUM("manual", "google"),
      allowNull: false,
      defaultValue: "manual",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed("password") && user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

export default User;
