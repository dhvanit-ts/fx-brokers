import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";
import { createJsonValidator, S } from "../utils/createJsonValidator";

const CloneFirm = sequelize.define("clone_firms", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  broker_id: {
    type: DataTypes.INTEGER,
  },
  name: { type: DataTypes.STRING },
  link: { type: DataTypes.STRING },
  logo: { type: DataTypes.STRING },
  score: { type: DataTypes.INTEGER },
  tags: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: createJsonValidator(S.array().of(S.string()).build()),
    },
  },
});

export default CloneFirm;
