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
  Broker.hasMany(BizArea, { foreignKey: "broker_id" });
  BizArea.belongsTo(Broker, { foreignKey: "broker_id" });

  Broker.hasMany(CloneFirm, { foreignKey: "broker_id" });
  CloneFirm.belongsTo(Broker, { foreignKey: "broker_id" });

  Broker.hasOne(Environment, { foreignKey: "broker_id" });
  Environment.belongsTo(Broker, { foreignKey: "broker_id" });

  Broker.hasMany(License, { foreignKey: "broker_id" });
  License.belongsTo(Broker, { foreignKey: "broker_id" });

  Broker.hasMany(Market, { foreignKey: "broker_id" });
  Market.belongsTo(Broker, { foreignKey: "broker_id" });
  
  Broker.hasOne(MT, { foreignKey: "broker_id" });
  MT.belongsTo(Broker, { foreignKey: "broker_id" });

  Broker.hasMany(Spreads, { foreignKey: "broker_id" });
  Spreads.belongsTo(Broker, { foreignKey: "broker_id" });

  await sequelize.sync({ alter: true }); // auto-create/update tables
};
