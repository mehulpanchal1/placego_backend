const mongoose = require("mongoose");
const display = require("./_displayFields");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    tag: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    features: [{ type: String, trim: true, maxlength: 200 }],
    featured: { type: Boolean, default: false },
    ...display
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
