import express from "express";
import "dotenv/config";
import job from "./config/cron.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taxReturnRoutes from "./routes/taxReturnRoutes.js";
import employmentIncomeRoutes from "./routes/employmentIncomeRoutes.js";
import businessIncomeRoutes from "./routes/businessIncomeRoutes.js";
import investmentIncomeRoutes from "./routes/investmentIncomeRoutes.js";
import qualifyingRoutes from "./routes/qualifyingPaymentRoutes.js";
import taxPaymentRoutes from "./routes/taxPaymentRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
job.start();
app.use(express.json());
app.use(cors());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/tax", taxReturnRoutes);
app.use("/api/employment-income", employmentIncomeRoutes);
app.use("/api/business-income", businessIncomeRoutes);
app.use("/api/investment-income", investmentIncomeRoutes);
app.use("/api/qualifying-payments", qualifyingRoutes);
app.use("/api/tax-payments", taxPaymentRoutes);

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
  connectDB();
});
