import express from "express";
import cloudinary from "../config/cloudinary.js";
import TaxReturn from "../models/TaxReturn.js";

const router = express.Router();

export const create = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!image || !title || !caption || !rating)
      return res.status(400).json({ message: "Please provide all fields" });

    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    const newTaxReturn = new TaxReturn({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newTaxReturn.save();
    res.status(201).json(newTaxReturn);
  } catch (error) {
    console.log("Error creating tax return", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const taxReturns = await TaxReturn.find();
    res.send(taxReturns);
  } catch (error) {
    console.log("Error in get all books route", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReturn = async (req, res) => {
  try {
    const taxReturn = await TaxReturn.findById(req.params.id);
    if (!taxReturn)
      return res.status(404).json({ message: "Return not found" });

    if (taxReturn.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    if (taxReturn.image && taxReturn.image.includes("cloudinary")) {
      try {
        const publicId = taxReturn.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await taxReturn.deleteOne();

    res.json({ message: "Return deleted successfully" });
  } catch (error) {
    console.log("Error deleting return", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUserReturns = async (req, res) => {
  try {
    const taxReturns = await TaxReturn.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.send(taxReturns);
  } catch (error) {
    console.log("Error in get all user books route", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
