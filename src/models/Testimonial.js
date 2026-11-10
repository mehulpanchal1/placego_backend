const mongoose = require("mongoose");
const display = require("./_displayFields");

const testimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true, trim: true, maxlength: 1000 },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    designation: { type: String, trim: true, maxlength: 100 },
    company: { type: String, trim: true, maxlength: 120 },
    ...display
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
