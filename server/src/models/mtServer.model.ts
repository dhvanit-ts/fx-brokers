import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";
import { createJsonValidator, S } from "../utils/createJsonValidator";

const MetaTraders = sequelize.define("meta_traders", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  broker_id: {
    type: DataTypes.INTEGER,
  },
  executionSpeed: { type: DataTypes.INTEGER },
  licenses: {
    type: DataTypes.JSON,
    validate: {
      schema: createJsonValidator(S.array().of(S.string()).build()),
    },
  },
  servers: {
    type: DataTypes.JSON,
    validate: {
      schema: createJsonValidator(
        S.array()
          .of(
            S.object({
              platform: S.string(),
              brokerName: S.string(),
              country: S.string(),
              ping: S.number(),
              leverage: S.string(),
              serverIps: S.array().of(
                S.object({
                  ip: S.string(),
                  ping: S.number(),
                  pingStatus: S.string(),
                  country: S.string(),
                  flag: S.string(),
                })
              ),
            })
          )
          .build()
      ),
    },
  },
  countryRegion: {
    type: DataTypes.JSON,
    validate: {
      schema: createJsonValidator(
        S.array()
          .of(
            S.object({
              country: S.string(),
              flag: S.string(),
              firstValue: S.string(),
              secondValue: S.string(),
            })
          )
          .build()
      ),
    },
  },
});

export default MetaTraders;
