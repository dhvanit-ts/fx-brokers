import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";

const Spreads = sequelize.define("spreads", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  broker_id: {
    type: DataTypes.INTEGER,
  },
  tradingPair: { type: DataTypes.STRING },
  buy: { type: DataTypes.STRING },
  account: { type: DataTypes.STRING },
  spread: { type: DataTypes.STRING },
  avgSpreadDay: { type: DataTypes.STRING },
  longSwap: { type: DataTypes.STRING },
  shortSwap: { type: DataTypes.STRING },
});

export default Spreads;
