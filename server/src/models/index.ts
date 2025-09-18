import { sequelize } from "../db/connect";
import Admin from "./admin.model";
import User from "./user.model";
import BizArea from "./bizArea.model";
import Broker from "./broker.model";
import CloneFirm from "./clonefirm.model";
import Environment from "./environment.model";
import License from "./license.model";
import Market from "./marketer.model";
import MT from "./mtServer.model";
import Spreads from "./spread.model";

export const dbInit = async () => {
  Broker.hasMany(BizArea, { foreignKey: "broker" });
  BizArea.belongsTo(Broker, { foreignKey: "broker" });

  Broker.hasMany(CloneFirm, { foreignKey: "broker" });
  CloneFirm.belongsTo(Broker, { foreignKey: "broker" });

  Broker.hasOne(Environment, { foreignKey: "broker" });
  Environment.belongsTo(Broker, { foreignKey: "broker" });

  Broker.hasMany(License, { foreignKey: "broker" });
  License.belongsTo(Broker, { foreignKey: "broker" });

  Broker.hasMany(Market, { foreignKey: "broker" });
  Market.belongsTo(Broker, { foreignKey: "broker" });

  Broker.hasOne(MT, { foreignKey: "broker" });
  MT.belongsTo(Broker, { foreignKey: "broker" });

  Broker.hasMany(Spreads, { foreignKey: "broker" });
  Spreads.belongsTo(Broker, { foreignKey: "broker" });

  await sequelize.sync({ alter: true }); // auto-create/update tables
};
