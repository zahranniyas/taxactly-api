import EmploymentIncome from "../models/EmploymentIncome.js";
import { calcMonthlyPAYE } from "../utils/calcPaye.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

export const createEmploymentIncome = async (req, res) => {
  try {
    const {
      companyName,
      employeeId,
      regularMonthlySalary,
      isPrimary,
      taxYear,
    } = req.body;

    const months = Array.from({ length: 12 }).map((_, idx) => {
      const paye = isPrimary
        ? calcMonthlyPAYE(regularMonthlySalary)
        : Math.round(regularMonthlySalary * 0.18);
      return {
        monthIndex: idx,
        gross: regularMonthlySalary,
        paye,
        net: regularMonthlySalary - paye,
      };
    });

    const doc = await EmploymentIncome.create({
      userId: req.user._id,
      taxYear,
      companyName,
      employeeId,
      isPrimary,
      regularMonthlySalary,
      months,
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getEmploymentIncome = async (req, res) => {
  const data = await EmploymentIncome.findOne({
    userId: req.user._id,
    taxYear: req.params.taxYear,
  });
  res.json(data);
};

const upload = multer({ storage: multer.memoryStorage() });

export const updateMonthlyActual = [
  upload.single("payslip"),

  async (req, res) => {
    try {
      console.log(
        "file?",
        !!req.file,
        req.file?.originalname,
        "size",
        req.file?.size
      );
      const { id, idx } = req.params;
      const { actualGross } = req.body;

      const doc = await EmploymentIncome.findById(id);
      if (!doc) return res.status(404).json({ message: "Record not found" });

      const month = doc.months[idx];

      if (actualGross) {
        month.actualGross = Number(actualGross);
        month.actualPaye = calcMonthlyPAYE(month.actualGross);
        month.net = month.actualGross - month.actualPaye;
      }

      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "taxactly/payslips" },
            (err, result) => (err ? reject(err) : resolve(result))
          );
          stream.end(req.file.buffer);
        });
        month.payslipUrl = result.secure_url;
      }

      await doc.save();
      res.json(month);
    } catch (err) {
      console.error("Update month error:", err);
      res.status(500).json({ message: err.message });
    }
  },
];

// PUT /employment-income/:id
export const updateEmploymentIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, employeeId, regularMonthlySalary, isPrimary } =
      req.body;
    const gross = Number(regularMonthlySalary);

    const months = Array.from({ length: 12 }).map((_, idx) => {
      const paye = isPrimary
        ? calcMonthlyPAYE(gross)
        : Math.round(gross * 0.18);
      return {
        monthIndex: idx,
        gross,
        paye,
        net: gross - paye,
      };
    });

    const doc = await EmploymentIncome.findByIdAndUpdate(
      id,
      {
        companyName,
        employeeId,
        regularMonthlySalary: gross,
        isPrimary,
        months,
      },
      { new: true, runValidators: true }
    );

    res.json(doc);
  } catch (err) {
    console.error("updateEmploymentIncome error:", err);
    res.status(500).json({ message: err.message });
  }
};
