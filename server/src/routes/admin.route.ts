import { Router } from "express";
import {
  createAdmin,
  getAdminData,
  loginAdmin,
} from "../controllers/admin.controller";
import { verifyAdminJWT } from "../middlewares/auth.middleware";

const router = Router();
router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.get("/me", verifyAdminJWT, getAdminData);

export default router;
