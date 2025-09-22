import BizArea from "../models/bizArea.model";
import Broker from "../models/broker.model";
import CloneFirm from "../models/clonefirm.model";
import Environment from "../models/environment.model";
import License from "../models/license.model";
import Market from "../models/marketer.model";
import Spreads from "../models/spread.model";
import MT from "../models/mtServer.model";
import { ApiError } from "../utils/ApiHelpers";
import brokers from "../data/brokers.json";

export const bulkInsertBrokers = async (brokers: any[]) => {
  try {
    if (!brokers || !Array.isArray(brokers) || brokers.length === 0) {
      return new ApiError(400, "Invalid brokers data");
    }

    // Collect broker objects first
    const allBrokers: any[] = brokers
      .map((b) => ({ ...b.broker, about: b.about }))
      .filter(Boolean);

    // Insert brokers
    const brokerResults = await Broker.bulkCreate(allBrokers, {
      returning: true,
    });
    console.log("Brokers inserted successfully!");

    // Collect related data with broker_id assigned
    const allMT: any[] = [];
    const allEnvironments: any[] = [];
    const allBizAreas: any[] = [];
    const allCloneFirms: any[] = [];
    const allLicenses: any[] = [];
    const allMarkets: any[] = [];
    const allSpreads: any[] = [];

    brokers.forEach((brokerObj, index) => {
      const brokerRecord = brokerResults[index];
      if (!brokerRecord) return;

      const brokerId = brokerRecord.dataValues.id; // primary key from DB

      if (brokerObj.mt) {
        const mts = Array.isArray(brokerObj.mt) ? brokerObj.mt : [brokerObj.mt];
        allMT.push(...mts.map((m: any) => ({ ...m, broker_id: brokerId })));
      }

      if (brokerObj.environment) {
        const envs = Array.isArray(brokerObj.environment)
          ? brokerObj.environment
          : [brokerObj.environment];
        allEnvironments.push(
          ...envs.map((e: any) => ({ ...e, broker_id: brokerId }))
        );
      }

      if (brokerObj.bizArea) {
        allBizAreas.push(
          ...brokerObj.bizArea.map((b: any) => ({ ...b, broker_id: brokerId }))
        );
      }

      if (brokerObj.cloneFirms) {
        allCloneFirms.push(
          ...brokerObj.cloneFirms.map((c: any) => ({
            ...c,
            broker_id: brokerId,
          }))
        );
      }

      if (brokerObj.licenses) {
        allLicenses.push(
          ...brokerObj.licenses.map((l: any) => ({ ...l, broker_id: brokerId }))
        );
      }

      if (brokerObj.markets) {
        allMarkets.push(
          ...brokerObj.markets.map((m: any) => ({ ...m, broker_id: brokerId }))
        );
      }

      if (brokerObj.spreads) {
        allSpreads.push(
          ...brokerObj.spreads.map((s: any) => ({ ...s, broker_id: brokerId }))
        );
      }
    });

    console.log("Data processed!");
    console.log("MT:", allMT.length);
    console.log("Envs:", allEnvironments.length);
    console.log("BizAreas:", allBizAreas.length);
    console.log("CloneFirms:", allCloneFirms.length);
    console.log("Licenses:", allLicenses.length);
    console.log("Markets:", allMarkets.length);
    console.log("Spreads:", allSpreads.length);

    // Bulk insert related models
    if (allMT.length) await MT.bulkCreate(allMT);
    if (allEnvironments.length) await Environment.bulkCreate(allEnvironments);
    if (allBizAreas.length) await BizArea.bulkCreate(allBizAreas);
    if (allCloneFirms.length) await CloneFirm.bulkCreate(allCloneFirms);
    if (allLicenses.length) await License.bulkCreate(allLicenses);
    if (allMarkets.length) await Market.bulkCreate(allMarkets);
    if (allSpreads.length) await Spreads.bulkCreate(allSpreads);

    console.log("All related models inserted");

    return brokerResults;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// bulkInsertBrokers(brokers as any[]);