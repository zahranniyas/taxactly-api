import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true },
    fileUrl: String,
  },
  { _id: true }
);

const businessIncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taxYear: { type: String, required: true },
  transactions: [transactionSchema],
});

businessIncomeSchema.index({ userId: 1, taxYear: 1 }, { unique: true });

export default mongoose.model("BusinessIncome", businessIncomeSchema);
