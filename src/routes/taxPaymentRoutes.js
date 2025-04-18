import { Router } from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  getTaxPayments,
  ensureTaxDoc,
  addPayment,
  updatePayment,
  deletePayment,
} from "../controllers/taxPaymentController.js";

const router = Router();
router.use(protectedRoute);

router.get("/:taxYear", getTaxPayments);
router.post("/", ensureTaxDoc);

router.post("/:id/payment", addPayment);
router.put("/:id/payment/:pid", updatePayment);
router.delete("/:id/payment/:pid", deletePayment);

export default router;
