import { Router } from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  getInvestmentIncome,
  ensureInvestmentDoc,
  addLine,
  updateLine,
  deleteLine,
} from "../controllers/investmentIncomeController.js";

const router = Router();
router.use(protectedRoute);

router.get("/:taxYear", getInvestmentIncome);
router.post("/", ensureInvestmentDoc);

router.post("/:id/line", addLine);
router.put("/:id/line/:lid", updateLine);
router.delete("/:id/line/:lid", deleteLine);

export default router;
