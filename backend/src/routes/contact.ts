import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import { AppDataSource } from "../data-source";
import { Property } from "../entity/property";
import { User } from "../entity/user";

const router = Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Boolean(process.env.SMTP_SECURE === "true"),
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

router.post("/email", async (req: Request, res: Response) => {
  try {
    const { propertyId, fromName, fromEmail, message } = req.body || {};

    if (!propertyId || !fromEmail || !message) {
      return res.status(400).send({ error: "propertyId, fromEmail and message are required" });
    }

    const propertyRepo = AppDataSource.getRepository(Property);
    const property = await propertyRepo.findOne({ where: { id: Number(propertyId) }, relations: ["owner"] });
    if (!property || !property.owner) {
      return res.status(404).send({ error: "Property not found" });
    }

    const ownerRepo = AppDataSource.getRepository(User);
    const owner = await ownerRepo.findOne({ where: { id: property.owner.id } });
    if (!owner || !owner.email) {
      return res.status(404).send({ error: "Owner email not found" });
    }

    const toAddress = owner.email;
    const fromAddress = process.env.FROM_EMAIL || process.env.SMTP_USER || fromEmail;

    const subject = `Inquiry about: ${property.title}`;
    const html = `
      <div>
        <p>You received a new inquiry for your listing: <strong>${property.title}</strong></p>
        <p><strong>From:</strong> ${fromName ? `${fromName} - ` : ""}${fromEmail}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap">${String(message)}</p>
        <hr />
        <p>Property: ${property.title} — ${property.address}, ${property.city}</p>
      </div>
    `;

    await transporter.sendMail({
      to: toAddress,
      from: fromAddress,
      replyTo: fromEmail,
      subject,
      html,
    });

    res.send({ ok: true, message: "Email sent to property owner" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ error: "Failed to send email" });
  }
});

export default router;


