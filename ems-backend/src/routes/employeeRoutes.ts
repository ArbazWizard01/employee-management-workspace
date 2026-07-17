import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateManager,
  getDirectReports,
  getOrgTree,
} from "../controllers/employeeController";

const router = Router();

router.use(authenticate);

router.get("/organization/tree", getOrgTree);
router.get("/:id/reportees", getDirectReports);
router.patch(
  "/:id/manager",
  authorize(["Super Admin", "HR Manager"]),
  updateManager,
);

router.post("/", authorize(["Super Admin", "HR Manager"]), createEmployee);
router.get("/", authorize(["Super Admin", "HR Manager"]), getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", authorize(["Super Admin"]), deleteEmployee);

export default router;
