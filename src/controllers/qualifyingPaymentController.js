import QualifyingPayments from "../models/QualifyingPayments.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });

const deduction = (type, amount) =>
  type === "Solar"
    ? Math.min(amount, 600000)
    : type === "Charity"
    ? Math.min(amount, 75000)
    : amount;

export const getQualifying = async (req, res) => {
  const doc = await QualifyingPayments.findOne({
    userId: req.user._id,
    taxYear: req.params.taxYear,
  });
  res.json(doc);
};

export const ensureQualifyingDoc = async (req, res) => {
  const { taxYear } = req.body;
  const doc = await QualifyingPayments.findOneAndUpdate(
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
    const { date, type, amount } = req.body;

    let fileUrl;
    if (req.file) {
      fileUrl = await new Promise((r, e) =>
        cloudinary.uploader
          .upload_stream({ folder: "taxactly/qualifying" }, (err, out) =>
            err ? e(err) : r(out.secure_url)
          )
          .end(req.file.buffer)
      );
    }

    const line = {
      date,
      type,
      amount,
      deductible: deduction(type, amount),
      fileUrl,
    };

    const doc = await QualifyingPayments.findByIdAndUpdate(
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

    if (updates.type || updates.amount) {
      const doc = await QualifyingPayments.findOne(
        { _id: id, "lines._id": lid },
        { "lines.$": 1 }
      );
      const cur = doc.lines[0];
      const type = updates.type ?? cur.type;
      const amt = Number(updates.amount ?? cur.amount);
      updates.deductible = deduction(type, amt);
    }

    if (req.file) {
      updates.fileUrl = await new Promise((r, e) =>
        cloudinary.uploader
          .upload_stream({ folder: "taxactly/qualifying" }, (err, out) =>
            err ? e(err) : r(out.secure_url)
          )
          .end(req.file.buffer)
      );
    }

    const doc = await QualifyingPayments.findOneAndUpdate(
      { _id: id, "lines._id": lid },
      { $set: { "lines.$": { _id: lid, ...updates } } },
      { new: true }
    );
    res.json(doc);
  },
];

export const deleteLine = async (req, res) => {
  const { id, lid } = req.params;
  const doc = await QualifyingPayments.findByIdAndUpdate(
    id,
    { $pull: { lines: { _id: lid } } },
    { new: true }
  );
  res.json(doc);
};
