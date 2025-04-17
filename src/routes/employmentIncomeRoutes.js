import { Router } from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  createEmploymentIncome,
  getEmploymentIncome,
  updateMonthlyActual,
} from "../controllers/employmentIncomeController.js";

const router = Router();
router.use(protectedRoute);

router.post("/", createEmploymentIncome);
router.get("/:taxYear", getEmploymentIncome);
router.put("/:id/month/:idx", updateMonthlyActual);

export default router;
