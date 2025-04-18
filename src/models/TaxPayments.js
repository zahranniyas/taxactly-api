import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4", "Final"],
      required: true,
    },
    amount: { type: Number, required: true },
    fileUrl: String,
  },
  { _id: true }
);

const taxPaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taxYear: { type: String, required: true },
  payments: [paymentSchema],
});

taxPaymentSchema.index({ userId: 1, taxYear: 1 }, { unique: true });

export default mongoose.model("TaxPayments", taxPaymentSchema);
