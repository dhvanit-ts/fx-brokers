import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";
import { createJsonValidator, S } from "../utils/createJsonValidator";
import z from "zod";

const dataPointSchema = S.object({
  name: S.string(),
  value: S.string(),
});

const datasetSchema = S.object({
  name: S.string(),
  data: S.array(dataPointSchema),
});

const BizArea = sequelize.define("biz_area", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  broker: {
    type: DataTypes.NUMBER,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  ranking: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: createJsonValidator(
        S.array(
          S.object({
            country: S.string(),
            code: S.string(),
            value: S.number(),
            flag: S.string(),
          })
        ).build()
      ),
    },
  },
  chart: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: createJsonValidator(
        S.object({
          labels: S.array().of(S.string()),
          datasets: S.array(datasetSchema),
        }).build()
      ),
    },
  },
});

export default BizArea;
