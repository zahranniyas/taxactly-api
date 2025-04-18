import { Router } from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  getQualifying,
  ensureQualifyingDoc,
  addLine,
  updateLine,
  deleteLine,
} from "../controllers/qualifyingPaymentController.js";

const router = Router();
router.use(protectedRoute);

router.get("/:taxYear", getQualifying);
router.post("/", ensureQualifyingDoc);

router.post("/:id/line", addLine);
router.put("/:id/line/:lid", updateLine);
router.delete("/:id/line/:lid", deleteLine);

export default router;
