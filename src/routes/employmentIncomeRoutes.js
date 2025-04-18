import { Router } from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  createEmploymentIncome,
  getEmploymentIncome,
  updateEmploymentIncome,
  updateMonthlyActual,
} from "../controllers/employmentIncomeController.js";

const router = Router();
router.use(protectedRoute);

router.post("/", createEmploymentIncome);
router.get("/:taxYear", getEmploymentIncome);
router.put("/:id/month/:idx", updateMonthlyActual);
router.put("/:id", updateEmploymentIncome);

export default router;
