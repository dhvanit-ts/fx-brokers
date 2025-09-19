import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";

const Market = sequelize.define("markets", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  broker_id: {
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
});

export default Market;
