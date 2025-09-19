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
    type: DataTypes.STRING,
    validate: {
      schema: createJsonValidator(
        S.object({
          brokerInformation: S.array().of(S.string()),
          companyName: S.array().of(S.string()),
          abbreviation: S.array().of(S.string()),
          regulatoryStatus: S.array().of(S.string()),
          companyWebsite: S.array().of(S.string()),
          nbp: S.array().of(S.string()),
          timeOfFirstCollection: S.array().of(S.string()),
          phoneOfTheCompany: S.array().of(S.string()),
          x: S.array().of(S.string()),
          facebook: S.array().of(S.string()),
          instagram: S.array().of(S.string()),
          youtube: S.array().of(S.string()),
          companyAddress: S.array().of(S.string()),
          linkedin: S.array().of(S.string()),
          whatsapp: S.array().of(S.string()),
          qq: S.array().of(S.string()),
          wechat: S.array().of(S.string()),
          customerServiceEmailAddress: S.array().of(S.string()),
          registeredRegion: S.array().of(S.string()),
          operatingPeriod: S.array().of(S.string()),
          contactNumber: S.array().of(S.string()),
        }).build()
      ),
    },
  },
});

export default Broker;
