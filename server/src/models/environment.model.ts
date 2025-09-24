import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";
import { createJsonValidator, S } from "../utils/createJsonValidator";

const statsObj = S.object({
  value: S.number(),
  rating: S.string(),
});

const statsValidator = createJsonValidator(S.array().of(statsObj).build());

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
  broker_id: {
    type: DataTypes.INTEGER,
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
              value: S.number(),
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
  summary: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: createJsonValidator(
        S.array(
          S.object({
            ranking: S.array(S.number(), S.number()),
            testUsers: S.number(), // e.g. "1,189"
            orders: S.number(), // e.g. "3,111"
            margin: S.string(),
          })
        ).build()
      ),
    },
  },
  charts: {
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
  updatedAt: { type: DataTypes.DATE },
});

export default Environment;
