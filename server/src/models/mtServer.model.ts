import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";

const MetaTraders = sequelize.define("metatraders", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  broker: {
    type: DataTypes.NUMBER,
  },
  platform: { type: DataTypes.STRING },
  serverName: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  leverageList: { type: DataTypes.STRING },
  // leverageTable: {},
  serverIp: { type: DataTypes.STRING },
  ping: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  logo: { type: DataTypes.STRING },
  rating: { type: DataTypes.STRING },
});

export default MetaTraders;
