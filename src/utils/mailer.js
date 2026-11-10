const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
}

async function verifyMailer() {
  const t = getTransporter();
  if (!t) return console.log("Email: SMTP not configured, enquiries will be saved without email notifications.");
  try {
    await t.verify();
    console.log("Email: SMTP ready (" + process.env.SMTP_HOST + ")");
  } catch (e) {
    console.warn("Email: SMTP check failed:", e.message);
  }
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function row(label, value) {
  if (!value) return "";
  return `<tr><td style="padding:8px 12px;color:#55627D;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
          <td style="padding:8px 12px;color:#0E1A33;font-size:14px">${esc(value)}</td></tr>`;
}

function shell(title, inner) {
  return `<div style="font-family:Segoe UI,Arial,sans-serif;background:#F4F7FD;padding:24px">
    <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #DCE4F2;border-radius:12px;overflow:hidden">
      <div style="background:#081B4B;color:#fff;padding:18px 24px;font-size:18px;font-weight:700">PlaceGo · ${title}</div>
      <div style="padding:20px 24px">${inner}</div>
      <div style="padding:14px 24px;background:#F4F7FD;color:#55627D;font-size:12px">PlaceGo · 8/356, Sector 8, Malviya Nagar, Jaipur · +91 96367 13474</div>
    </div></div>`;
}

async function sendEnquiryEmails(c) {
  const t = getTransporter();
  if (!t) return;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  // 1) Notification to the PlaceGo team
  await t.sendMail({
    from,
    to: process.env.MAIL_TO || process.env.SMTP_USER,
    replyTo: c.email,
    subject: `New enquiry: ${c.name}${c.service ? " · " + c.service : ""}`,
    text: `Name: ${c.name}\nEmail: ${c.email}\nPhone: ${c.phone || "-"}\nCompany: ${c.company || "-"}\nInterest: ${c.service || "-"}\n\n${c.message}`,
    html: shell(
      "New website enquiry",
      `<table style="border-collapse:collapse;width:100%">
        ${row("Name", c.name)}${row("Email", c.email)}${row("Phone", c.phone)}${row("Company", c.company)}${row("Interested in", c.service)}
      </table>
      <div style="margin-top:14px;padding:14px;background:#F4F7FD;border-radius:8px;white-space:pre-wrap;font-size:14px;color:#0E1A33">${esc(c.message)}</div>
      <p style="font-size:12px;color:#55627D;margin-top:14px">Reply to this email to respond directly to ${esc(c.name)}.</p>`
    )
  });

  // 2) Auto-reply to the visitor
  if (String(process.env.SEND_AUTO_REPLY || "true") === "true") {
    await t.sendMail({
      from,
      to: c.email,
      subject: "We received your message · PlaceGo",
      text: `Hi ${c.name},\n\nThank you for contacting PlaceGo. Our team has received your message and will reply within one business day.\n\nRegards,\nTeam PlaceGo\n+91 96367 13474 · info@placego.online`,
      html: shell(
        "Thank you",
        `<p style="font-size:15px;color:#0E1A33">Hi ${esc(c.name)},</p>
         <p style="font-size:15px;color:#0E1A33;line-height:1.6">Thank you for contacting PlaceGo. Our team has received your message and will reply within one business day.</p>
         <p style="font-size:15px;color:#0E1A33">Regards,<br><b>Team PlaceGo</b></p>`
      )
    });
  }
}

module.exports = { sendEnquiryEmails, verifyMailer };
