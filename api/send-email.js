import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message, to, passcode } = req.body || {};

  const { GMAIL_USER, GMAIL_APP_PASSWORD, SITE_PASSCODE } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !SITE_PASSCODE) {
    res.status(500).json({ error: "Server is not configured" });
    return;
  }

  if (!passcode || passcode !== SITE_PASSCODE) {
    res.status(401).json({ error: "Invalid access code" });
    return;
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  if (!to || typeof to !== "string" || !EMAIL_RE.test(to)) {
    res.status(400).json({ error: "Valid recipient email is required" });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: GMAIL_USER,
      to,
      subject: "New message from Click to Send",
      text: message,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email" });
  }
}
