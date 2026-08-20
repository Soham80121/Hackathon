const Policy = require("../models/Policy");
const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// Get all policies
exports.getPolicies = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database connection is down. Please check your network or MongoDB Atlas." });
    }

    const policies = await Policy.find().select("-textContent").sort({ uploadedAt: -1 });
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload policy
exports.uploadPolicy = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Please provide a title" });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    
    let pdfText = "";
    try {
      const parser = new PDFParse({ data: dataBuffer });
      const result = await parser.getText();
      await parser.destroy();
      pdfText = result.text || "";
    } catch (parseError) {
      // Clean up the uploaded file if parsing fails
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({ message: "Invalid or corrupted PDF file. Could not extract text." });
    }

    const newPolicy = await Policy.create({
      title,
      filename: req.file.originalname,
      filePath: req.file.path.replace(/\\/g, "/"),
      textContent: pdfText,
    });

    await Notification.create({
      userId: req.user.id,
      title: "HR Policy Uploaded",
      message: `The policy "${title}" has been uploaded successfully.`,
      type: "success"
    });

    const { textContent, ...policyWithoutText } = newPolicy.toObject();

    res.status(201).json(policyWithoutText);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete policy
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    // Delete file if it exists
    const absolutePath = path.join(__dirname, "../", policy.filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await Policy.findByIdAndDelete(req.params.id);

    await Notification.create({
      userId: req.user.id,
      title: "HR Policy Deleted",
      message: `The policy "${policy.title}" has been deleted.`,
      type: "warning"
    });

    res.json({ message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
