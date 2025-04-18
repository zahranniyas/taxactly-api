import { Router } from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  getBusinessIncome,
  ensureBusinessDoc,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/businessIncomeController.js";

const router = Router();
router.use(protectedRoute);

router.get("/:taxYear", getBusinessIncome);
router.post("/", ensureBusinessDoc);

router.post("/:id/transaction", addTransaction);
router.put("/:id/transaction/:tid", updateTransaction);
router.delete("/:id/transaction/:tid", deleteTransaction);

export default router;
