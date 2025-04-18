import express from "express";
import {
  create,
  getAll,
  deleteReturn,
  getAllUserReturns,
} from "../controllers/taxReturnController.js";
import protectedRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, create);
router.get("/", protectedRoute, getAll);
router.get("/user", protectedRoute, getAllUserReturns);
router.delete("/:id", protectedRoute, deleteReturn);

export default router;
