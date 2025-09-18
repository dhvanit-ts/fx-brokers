import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";
import { createJsonValidator, S } from "../utils/createJsonValidator";

const statsObj = S.object({
  value: S.string(),
  rating: S.string(),
});

const statsValidator = createJsonValidator(S.array(statsObj).build());

// extend schema
const extendedStatsValidator = createJsonValidator(
  S.array(
    statsObj.extend({
      label: S.string(),
    })
  ).build()
);

const Environment = sequelize.define("environment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  broker: {
    type: DataTypes.NUMBER,
  },
  tabs: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: createJsonValidator(S.array().of(S.string()).build()),
    },
  },
  speed: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: createJsonValidator(
        S.array()
          .of(
            S.object({
              label: S.string(),
              value: S.string(),
              rating: S.string(),
            })
          )
          .build()
      ),
    },
  },
  cost: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: statsValidator,
    },
  },
  overnight: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: statsValidator,
    },
  },
  slippage: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: extendedStatsValidator,
    },
  },
  offline: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: extendedStatsValidator,
    },
  },
  ranking: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: createJsonValidator(S.array(S.string(), S.string()).build()),
    },
  },
  summary: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: createJsonValidator(
        S.array(
          S.object({
            ranking: S.string(), // e.g. "12 / 125"
            testUsers: S.string(), // e.g. "1,189"
            orders: S.string(), // e.g. "3,111"
            margin: S.string(),
          })
        ).build()
      ),
    },
  },
  chart: {
    type: DataTypes.JSON,
    validate: {
      schema: createJsonValidator(
        S.object({})
          .additionalProperties(
            S.object({
              labels: S.array().of(S.string()),
              datasets: S.array().of(
                S.object({
                  name: S.string(),
                  data: S.array().of(S.number()),
                }).allowAdditionalProperties()
              ),
            })
          )
          .build()
      ),
    },
  },
  dataSource: { type: DataTypes.STRING },
  updatedAt: { type: DataTypes.STRING },
});

export default Environment;
