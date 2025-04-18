import mongoose from "mongoose";

const lineSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: ["Solar", "Charity", "Government"],
      required: true,
    },
    amount: { type: Number, required: true },
    deductible: { type: Number, required: true },
    fileUrl: String,
  },
  { _id: true }
);

const qpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taxYear: { type: String, required: true },
  lines: [lineSchema],
});

qpSchema.index({ userId: 1, taxYear: 1 }, { unique: true });

export default mongoose.model("QualifyingPayments", qpSchema);
