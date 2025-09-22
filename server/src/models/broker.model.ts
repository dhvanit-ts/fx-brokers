import { DataTypes } from "sequelize";
import { sequelize } from "../db/connect";
import { createJsonValidator, S } from "../utils/createJsonValidator";

const Broker = sequelize.define("brokers", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  tag: {
    type: DataTypes.STRING,
  },
  score: {
    type: DataTypes.STRING,
  },
  license: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  years: {
    type: DataTypes.STRING,
  },
  environmentRating: {
    type: DataTypes.STRING,
  },
  website: {
    type: DataTypes.STRING,
  },
  labels: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: createJsonValidator(S.array().of(S.string()).build()),
    },
  },
  environmentDetails: {
    type: DataTypes.JSON,
    validate: {
      schema: createJsonValidator(
        S.object({
          grade: S.string(),
          avgTransactionSpeed: S.string(),
          speedLabel: S.string(),
          mt4License: S.string(),
          mt4Server: S.string(),
          capital: S.string(),
          influenceGrade: S.string(),
          influenceScore: S.string(),
          influenceCountry: S.string(),
        }).build()
      ),
    },
  },
  contact: {
    type: DataTypes.JSON,
    validate: {
      schema: createJsonValidator(S.array().of(S.string()).build()),
    },
  },
  brokerLicenses: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      schema: createJsonValidator(S.array().of(S.string()).build()),
    },
  },
  about: {
    type: DataTypes.JSON,
    allowNull: true,
    validate: {
      schema: createJsonValidator(
        S.object({
          brokerInformation: S.array().of(S.string()).optional(),
          companyName: S.array().of(S.string()),
          abbreviation: S.array().of(S.string()),
          regulatoryStatus: S.array().of(S.string()),
          companyWebsite: S.array().of(S.string()),
          nbp: S.array().of(S.string()).optional(),
          timeOfFirstCollection: S.array().of(S.string()).optional(),
          phoneOfTheCompany: S.array().of(S.string()).optional(),
          x: S.array().of(S.string()).optional(),
          facebook: S.array().of(S.string()).optional(),
          instagram: S.array().of(S.string()).optional(),
          youtube: S.array().of(S.string()).optional(),
          companyAddress: S.array().of(S.string()),
          linkedin: S.array().of(S.string()).optional(),
          whatsapp: S.array().of(S.string()).optional(),
          qq: S.array().of(S.string()).optional(),
          wechat: S.array().of(S.string()).optional(),
          customerServiceEmailAddress: S.array().of(S.string()),
          registeredRegion: S.array().of(S.string()),
          operatingPeriod: S.array().of(S.string()),
          contactNumber: S.array().of(S.string()).optional(),
        }).build()
      ),
    },
  },
});

export default Broker;
