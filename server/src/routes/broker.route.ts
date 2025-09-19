import { Router } from "express";
import { bulkInsertBrokers, getBrokerById, getBrokers } from "../controllers/broker.controller";

const router = Router();
router.post("/insert/many", bulkInsertBrokers);
router.get("/get/all", getBrokers);
router.get("/get/one/:id", getBrokerById);

export default router;
