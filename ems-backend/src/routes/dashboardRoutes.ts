import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { getDashboardStats } from "../controllers/dashboardController";

const router = Router();

router.use(authenticate);
router.get(
  "/stats",
  authorize(["Super Admin", "HR Manager"]),
  getDashboardStats,
);

export default router;
