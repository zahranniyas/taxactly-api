import express from "express";
import {
  create,
  getAll,
  deleteReturn,
  getAllUserReturns,
} from "../controllers/taxReturnController.js";
import protectedRoute from "../middleware/auth.middleware.js";

const router = express.Router();

//create a tax return
router.post("/", protectedRoute, create);

//get all returns
router.get("/", protectedRoute, getAll);

//get all user returns
router.get("/user", protectedRoute, getAllUserReturns);

//delete a tax return
router.delete("/:id", protectedRoute, deleteReturn);

//update a tax return

export default router;
