import mongoose from "mongoose";

const MonthlySchema = new mongoose.Schema({
  monthIndex: { type: Number, required: true }, // 0 = Apr
  gross: { type: Number, required: true },
  paye: { type: Number, required: true },
  net: { type: Number, required: true },
  actualGross: { type: Number, default: null },
  actualPaye: { type: Number, default: null },
  payslipUrl: { type: String, default: null },
});

const EmploymentIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taxYear: { type: String, required: true }, // “2025-26”
    companyName: { type: String, required: true },
    employeeId: { type: String, required: true },
    isPrimary: { type: Boolean, default: true },
    regularMonthlySalary: { type: Number, required: true },
    months: [MonthlySchema],
  },
  { timestamps: true }
);

export default mongoose.model("EmploymentIncome", EmploymentIncomeSchema);
