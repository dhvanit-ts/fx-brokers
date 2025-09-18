import { Request, Response } from "express";
import BrokerModel from "../models/broker.model";
import BizArea from "../models/bizArea.model";
import CloneFirm from "../models/clonefirm.model";
import Environment from "../models/environment.model";
import License from "../models/license.model";
import Market from "../models/marketer.model";
import MT from "../models/mtServer.model";
import Spreads from "../models/spread.model";
import { ApiError, ApiResponse, AsyncHandler } from "../utils/ApiHelpers";

export const getBrokers = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const brokers = await BrokerModel.findAll();
    return new ApiResponse(200, brokers, "Brokers fetched successfully");
  } catch (error) {
    res.status(500).json({ message: "Error fetching brokers" });
  }
});

export const bulkInsertBrokers = AsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { brokers } = req.body;

      if (!brokers || !Array.isArray(brokers) || brokers.length === 0) {
        return new ApiError(400, "Invalid brokers data");
      }

      const results: any[] = [];
      
      for (const brokerObj of brokers) {

        const {
          brokers,
          bizArea,
          environment,
          mt,
          cloneFirms,
          licenses,
          markets,
          spreads,
        } = brokerObj;

        if (mt) await MT.create(mt);
        if (environment) await Environment.create(environment);
        if (bizArea) await BizArea.bulkCreate(bizArea);
        if (cloneFirms) await CloneFirm.bulkCreate(cloneFirms);
        if (licenses) await License.bulkCreate(licenses);
        if (markets) await Market.bulkCreate(markets);
        if (spreads) await Spreads.bulkCreate(spreads);

        const result = await BrokerModel.bulkCreate(brokers);
        results.push(result);
      }

      return new ApiResponse(201, results, "Brokers inserted successfully");
    } catch (error) {
      return new ApiResponse(500, null, "Error inserting brokers");
    }
  }
);
