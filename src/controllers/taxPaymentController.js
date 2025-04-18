import TaxPayments from "../models/TaxPayments.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });

export const getTaxPayments = async (req, res) => {
  const doc = await TaxPayments.findOne({
    userId: req.user._id,
    taxYear: req.params.taxYear,
  });
  res.json(doc);
};

export const ensureTaxDoc = async (req, res) => {
  const { taxYear } = req.body;
  const doc = await TaxPayments.findOneAndUpdate(
    { userId: req.user._id, taxYear },
    { $setOnInsert: { payments: [] } },
    { new: true, upsert: true }
  );
  res.json(doc);
};

export const addPayment = [
  upload.single("file"),
  async (req, res) => {
    const { id } = req.params;
    const { date, type, amount } = req.body;

    let fileUrl;
    if (req.file) {
      fileUrl = await new Promise((r, e) =>
        cloudinary.uploader
          .upload_stream({ folder: "taxactly/payments" }, (err, out) =>
            err ? e(err) : r(out.secure_url)
          )
          .end(req.file.buffer)
      );
    }

    const payment = { date, type, amount, fileUrl };

    const doc = await TaxPayments.findByIdAndUpdate(
      id,
      { $push: { payments: payment } },
      { new: true }
    );
    res.json(doc);
  },
];

export const updatePayment = [
  upload.single("file"),
  async (req, res) => {
    const { id, pid } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.fileUrl = await new Promise((r, e) =>
        cloudinary.uploader
          .upload_stream({ folder: "taxactly/payments" }, (err, out) =>
            err ? e(err) : r(out.secure_url)
          )
          .end(req.file.buffer)
      );
    }

    const doc = await TaxPayments.findOneAndUpdate(
      { _id: id, "payments._id": pid },
      { $set: { "payments.$": { _id: pid, ...updates } } },
      { new: true }
    );
    res.json(doc);
  },
];

export const deletePayment = async (req, res) => {
  const { id, pid } = req.params;
  const doc = await TaxPayments.findByIdAndUpdate(
    id,
    { $pull: { payments: { _id: pid } } },
    { new: true }
  );
  res.json(doc);
};
