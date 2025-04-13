import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taxReturnRoutes from "./routes/taxReturnRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/tax", taxReturnRoutes);

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
  connectDB();
});
