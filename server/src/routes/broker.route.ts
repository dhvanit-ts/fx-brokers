import { Router } from "express";
import { bulkInsertBrokers, getBrokers } from "../controllers/broker.controller";

const router = Router();
router.post("/insert/many", bulkInsertBrokers);
router.get("/get/all", getBrokers);

export default router;
