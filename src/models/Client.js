const mongoose = require("mongoose");
const display = require("./_displayFields");

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    sector: { type: String, trim: true, maxlength: 80 },
    logoUrl: { type: String, trim: true, maxlength: 500 },
    website: { type: String, trim: true, maxlength: 300 },
    ...display
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
