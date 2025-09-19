import { Request, Response } from "express";
import BrokerModel from "../models/broker.model";
import BizArea from "../models/bizArea.model";
import CloneFirm from "../models/clonefirm.model";
import Environment from "../models/environment.model";
import License from "../models/license.model";
import Market from "../models/marketer.model";
import MT from "../models/mtServer.model";
import Spreads from "../models/spread.model";
import brokers from "../data/brokers.json";
import { bulkInsertBrokers as bulkInsertBrokersHandler } from "../services/broker.service";
import { ApiError, ApiResponse, AsyncHandler } from "../utils/ApiHelpers";

export const getBrokers = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const brokers = await BrokerModel.findAll();
    return new ApiResponse(200, brokers, "Brokers fetched successfully");
  } catch (error) {
    res.status(500).json({ message: "Error fetching brokers" });
  }
});

export const getBrokerById = AsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) throw new ApiError(400, "broker Id is required");

      const broker = await BrokerModel.findByPk(Number(id), {
        include: [
          { model: MT },
          { model: Environment },
          { model: BizArea },
          { model: CloneFirm },
          { model: License },
          { model: Market },
          { model: Spreads },
        ],
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            broker?.dataValues,
            "Broker fetched successfully"
          )
        );
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error fetching the broker",
      });
    }
  }
);

export const bulkInsertBrokers = AsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const brokerResults = await bulkInsertBrokersHandler(brokers as any[]);

      return new ApiResponse(
        201,
        brokerResults,
        "Brokers inserted successfully"
      );
    } catch (error) {
      console.error(error);
      return new ApiResponse(500, null, "Error inserting brokers");
    }
  }
);
