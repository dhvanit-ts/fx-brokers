import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sequelize } from "../db/connect";
import { env } from "../conf/env";

class Admin extends Model<
  InferAttributes<Admin>,
  InferCreationAttributes<Admin>
> {
  declare id: number;
  declare username: string;
  declare password: string;

  // ✅ Check password
  async isPasswordCorrect(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // ✅ Generate access token
  generateAccessToken(): string {
    return jwt.sign(
      {
        id: this.id,
        username: this.username,
      },
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: `${parseInt(env.ACCESS_TOKEN_EXPIRY)}m`,
      }
    );
  }
}

Admin.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "admins",
    timestamps: true,
    hooks: {
      beforeSave: async (admin: Admin) => {
        if (admin.changed("password") && admin.password) {
          admin.password = await bcrypt.hash(admin.password, 12);
        }
      },
    },
  }
);

export default Admin;
