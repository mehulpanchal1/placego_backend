const Contact = require("../models/Contact");
const { asyncHandler, HttpError } = require("../middleware/error");
const { sendEnquiryEmails } = require("../utils/mailer");

// POST /api/contact  (public)
exports.create = asyncHandler(async (req, res) => {
  // Honeypot: real visitors never fill the hidden "website" field
  if (req.body.website) {
    return res.status(201).json({ success: true, message: "Thank you, we will get back to you shortly." });
  }

  const { name, email, phone, company, service, message } = req.body;
  const contact = await Contact.create({
    name, email, phone, company, service, message,
    ip: req.ip,
    userAgent: (req.get("user-agent") || "").slice(0, 300)
  });

  // Email in background so the visitor isn't kept waiting
  sendEnquiryEmails(contact).catch((e) => console.error("Email failed:", e.message));

  res.status(201).json({
    success: true,
    message: "Thank you, we will get back to you within one business day.",
    id: contact._id
  });
});

// GET /api/contact?page=&limit=&status=&search=  (admin)
exports.list = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    const rx = new RegExp(String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 100), "i");
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }, { message: rx }];
  }

  const [data, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select("-userAgent").lean(),
    Contact.countDocuments(filter)
  ]);
  res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// GET /api/contact/stats  (admin)
exports.stats = asyncHandler(async (req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [total, unread, byStatus, last7Days] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({ isRead: false }),
    Contact.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
    Contact.countDocuments({ createdAt: { $gte: weekAgo } })
  ]);
  const s = Object.fromEntries(byStatus.map((x) => [x._id, x.n]));
  res.json({
    success: true,
    data: { total, unread, new: s.new || 0, contacted: s.contacted || 0, closed: s.closed || 0, last7Days }
  });
});

// GET /api/contact/:id  (admin)
exports.getOne = asyncHandler(async (req, res) => {
  const doc = await Contact.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Enquiry not found");
  res.json({ success: true, data: doc });
});

// PATCH /api/contact/:id  (admin) — status, isRead, notes
exports.update = asyncHandler(async (req, res) => {
  const updates = {};
  for (const k of ["status", "isRead", "notes"]) if (req.body[k] !== undefined) updates[k] = req.body[k];
  const doc = await Contact.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!doc) throw new HttpError(404, "Enquiry not found");
  res.json({ success: true, data: doc });
});

// DELETE /api/contact/:id  (admin)
exports.remove = asyncHandler(async (req, res) => {
  const doc = await Contact.findByIdAndDelete(req.params.id);
  if (!doc) throw new HttpError(404, "Enquiry not found");
  res.json({ success: true, message: "Enquiry deleted" });
});
