const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    phone: { type: String, trim: true, maxlength: 20 },
    company: { type: String, trim: true, maxlength: 150 },
    service: { type: String, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
    isRead: { type: Boolean, default: false },
    notes: { type: String, trim: true, maxlength: 2000 },
    ip: String,
    userAgent: String
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });

module.exports = mongoose.model("Contact", contactSchema);
