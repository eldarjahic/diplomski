import "dotenv/config";
import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import Joi from "joi";

const router = Router();

// Security: Rate limiting - max 5 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation schema
const emailSchema = Joi.object({
  subject: Joi.string().required().min(1).max(200).trim(),
  text: Joi.string().required().min(1).max(10000).trim(),
  toEmail: Joi.string().email().required(),
});

console.log("OVO JE EMAIL USER", process.env.EMAIL_USER);
console.log("OVO JE EMAIL PASS", process.env.EMAIL_PASS);

// Simple Gmail transporter (App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email endpoint
router.post("/send", limiter, async (req: Request, res: Response) => {
  try {
    // Security: Input validation using Joi
    const { error, value } = emailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    const { subject, text, toEmail, fromEmail } = value;

    console.log("OVO SU MAILOVIIIIIIIIII", toEmail, fromEmail);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("OVO JE INFO", info);

    res.json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
      timestamp: new Date().toISOString(),
      emailInfo: {
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send email",
      message: "Internal server error",
    });
  }
});

export default router;
