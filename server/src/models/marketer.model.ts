import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";

const Market = sequelize.define("markets", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  broker: {
    type: DataTypes.NUMBER,
  },
  name: {
    type: DataTypes.STRING,
  },
});

export default Market;
