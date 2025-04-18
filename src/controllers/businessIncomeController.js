import BusinessIncome from "../models/BusinessIncome.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });

/* GET  /business-income/:taxYear */
export const getBusinessIncome = async (req, res) => {
  const doc = await BusinessIncome.findOne({
    userId: req.user._id,
    taxYear: req.params.taxYear,
  });
  res.json(doc);
};

/* POST  /business-income  – upsert empty doc for a tax year */
export const ensureBusinessDoc = async (req, res) => {
  const { taxYear } = req.body;
  const doc = await BusinessIncome.findOneAndUpdate(
    { userId: req.user._id, taxYear },
    { $setOnInsert: { transactions: [] } },
    { new: true, upsert: true }
  );
  res.json(doc);
};

/* POST  /business-income/:id/transaction  (add) */
export const addTransaction = [
  upload.single("file"),
  async (req, res) => {
    const { id } = req.params;
    const { date, type, category, description, amount } = req.body;

    let fileUrl;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "taxactly/business" }, (err, r) =>
            err ? reject(err) : resolve(r)
          )
          .end(req.file.buffer);
      });
      fileUrl = result.secure_url;
    }

    const doc = await BusinessIncome.findByIdAndUpdate(
      id,
      {
        $push: {
          transactions: {
            date,
            type,
            category,
            description,
            amount,
            fileUrl,
          },
        },
      },
      { new: true }
    );
    res.json(doc);
  },
];

/* PUT  /business-income/:id/transaction/:tid  (update) */
export const updateTransaction = [
  upload.single("file"),
  async (req, res) => {
    const { id, tid } = req.params;
    const updates = req.body;

    if (req.file) {
      const r = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "taxactly/business" }, (err, r) =>
            err ? reject(err) : resolve(r)
          )
          .end(req.file.buffer);
      });
      updates.fileUrl = r.secure_url;
    }

    const doc = await BusinessIncome.findOneAndUpdate(
      { _id: id, "transactions._id": tid },
      { $set: { "transactions.$": { _id: tid, ...updates } } },
      { new: true }
    );
    res.json(doc);
  },
];

/* DELETE  /business-income/:id/transaction/:tid */
export const deleteTransaction = async (req, res) => {
  const { id, tid } = req.params;
  const doc = await BusinessIncome.findByIdAndUpdate(
    id,
    { $pull: { transactions: { _id: tid } } },
    { new: true }
  );
  res.json(doc);
};
