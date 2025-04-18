import InvestmentIncome from "../models/InvestmentIncome.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });

const whtRate = (type) =>
  type === "Rent"
    ? 0.1
    : type === "Interest"
    ? 0.05
    : type === "Dividend"
    ? 0.15
    : 0;

export const getInvestmentIncome = async (req, res) => {
  const doc = await InvestmentIncome.findOne({
    userId: req.user._id,
    taxYear: req.params.taxYear,
  });
  res.json(doc);
};

export const ensureInvestmentDoc = async (req, res) => {
  const { taxYear } = req.body;
  const doc = await InvestmentIncome.findOneAndUpdate(
    { userId: req.user._id, taxYear },
    { $setOnInsert: { lines: [] } },
    { new: true, upsert: true }
  );
  res.json(doc);
};

export const addLine = [
  upload.single("file"),

  async (req, res) => {
    const { id } = req.params;
    const { date, type, category, amount } = req.body;

    let fileUrl;
    if (req.file) {
      fileUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "taxactly/investment" }, (err, r) =>
            err ? reject(err) : resolve(r.secure_url)
          )
          .end(req.file.buffer);
      });
    }

    const line = {
      date,
      type,
      category,
      amount,
      wht: Math.round(amount * whtRate(type)),
      fileUrl,
    };

    const doc = await InvestmentIncome.findByIdAndUpdate(
      id,
      { $push: { lines: line } },
      { new: true }
    );
    res.json(doc);
  },
];

export const updateLine = [
  upload.single("file"),

  async (req, res) => {
    const { id, lid } = req.params;
    const updates = req.body;

    if (updates.amount || updates.type) {
      const type = updates.type;
      const amt = updates.amount;
      if (type || amt) {
        const doc = await InvestmentIncome.findOne(
          { _id: id, "lines._id": lid },
          { "lines.$": 1 }
        );
        const line = doc.lines[0];
        const newAmt = amt ?? line.amount;
        const newType = type ?? line.type;
        updates.wht = Math.round(newAmt * whtRate(newType));
      }
    }

    if (req.file) {
      updates.fileUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "taxactly/investment" }, (err, r) =>
            err ? reject(err) : resolve(r.secure_url)
          )
          .end(req.file.buffer);
      });
    }

    const doc = await InvestmentIncome.findOneAndUpdate(
      { _id: id, "lines._id": lid },
      { $set: { "lines.$": { _id: lid, ...updates } } },
      { new: true }
    );
    res.json(doc);
  },
];

export const deleteLine = async (req, res) => {
  const { id, lid } = req.params;
  const doc = await InvestmentIncome.findByIdAndUpdate(
    id,
    { $pull: { lines: { _id: lid } } },
    { new: true }
  );
  res.json(doc);
};
