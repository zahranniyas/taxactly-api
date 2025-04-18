import mongoose from "mongoose";

const lineSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: ["Rent", "Interest", "Dividend", "Other"],
      required: true,
    },
    category: String,
    amount: { type: Number, required: true },
    wht: { type: Number, required: true },
    fileUrl: String,
  },
  { _id: true }
);

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taxYear: { type: String, required: true },
  lines: [lineSchema],
});

investmentSchema.index({ userId: 1, taxYear: 1 }, { unique: true });

export default mongoose.model("InvestmentIncome", investmentSchema);
