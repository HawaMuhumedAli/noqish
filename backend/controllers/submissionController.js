const Submission = require("../models/Submission");
const uploadToFirebase = require("../utils/firebase");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const studentId = req.user?.id;
    const file = req.file;

    if (!assignmentId || typeof assignmentId !== "string") {
      return res.status(400).json({ message: "Invalid assignment ID" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // 🔍 Step 1: Extract text
    const text = await extractTextFromFile(file);
    console.log("Extracted text: ", text);

    // 🤖 Step 2: Detect AI-generated content
    const aiCheck = await isAiGenerated(text);
    console.log("AI Detection Result: ", aiCheck);

    // ☁️ Step 3: Upload to Firebase
    const fileUrl = await uploadToFirebase(file);

    // 📝 Step 4: Save the submission, regardless of AI detection
    const submission = await Submission.create({
      assignmentId,
      studentId,
      fileUrl,
      aiDetected: aiCheck.detected,
      aiConfidence: aiCheck.confidence,
      aiDetectionUsed: true,
      status: aiCheck.detected ? "flagged" : "submitted",
    });

    // ✅ Step 5: Respond to frontend (warning if flagged)
    if (aiCheck.detected) {
      return res.status(201).json({
        submission,
        message: "⚠️ Assignment flagged due to AI-generated content",
        aiCheck,
      });
    }

    res.status(201).json({
      submission,
      message: "✅ Assignment submitted successfully",
      aiCheck,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit assignment", error });
  }
};

exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignmentId }).populate(
      "studentId",
      "username email"
    );
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions", error });
  }
};
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user.id });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

const extractTextFromFile = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  }
  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }
  if (ext === ".txt") {
    return file.buffer.toString("utf-8");
  }
  throw new Error("Unsupported file type for AI detection.");
};

const isAiGenerated = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Analyze the following text and determine if it is AI-generated or human-written. 
    Provide a probability score (0-100%) and reasoning:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();
    console.log("Gemini AI Analysis:", analysis);

    // Extract confidence score (simple parsing logic)
    const confidenceMatch = analysis.match(/(\d+)%/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 50;

    return {
      detected: confidence >= 80, // Mark AI-generated if score >= 80%
      confidence,
    };
  } catch (error) {
    console.warn("⚠️ Gemini AI detection failed.");
    console.error(error.message);
    return { detected: false, confidence: 0 };
  }
};
