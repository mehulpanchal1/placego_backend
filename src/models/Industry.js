const mongoose = require("mongoose");
const display = require("./_displayFields");

const industrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    icon: { type: String, trim: true, default: "grid", maxlength: 30 },
    points: [{ type: String, trim: true, maxlength: 200 }],
    segments: { type: String, trim: true, maxlength: 200 },
    ...display
  },
  { timestamps: true }
);

module.exports = mongoose.model("Industry", industrySchema);
