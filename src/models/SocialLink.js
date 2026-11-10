const mongoose = require("mongoose");
const display = require("./_displayFields");

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true, maxlength: 60 },
    url:      { type: String, required: true, trim: true, maxlength: 500 },
    icon:     { type: String, trim: true, maxlength: 60, default: "link" },
    ...display
  },
  { timestamps: true }
);

module.exports = mongoose.model("SocialLink", socialLinkSchema);
