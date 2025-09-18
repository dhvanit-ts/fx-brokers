import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";

const License = sequelize.define("licenses", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  broker: {
    type: DataTypes.NUMBER,
  },
  flag: { type: DataTypes.STRING },
  regulator: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  licenseType: { type: DataTypes.STRING },
});

export default License;
