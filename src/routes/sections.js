const express = require("express");
const { protect } = require("../middleware/auth");
const { asyncHandler, HttpError } = require("../middleware/error");
const SectionSetting = require("../models/SectionSetting");

const router = express.Router();

const DEFAULTS = [
  { key: "products",      label: "Products" },
  { key: "industries",    label: "Industries" },
  { key: "clients",       label: "Clients" },
  { key: "testimonials",  label: "Testimonials" },
  { key: "social-links",  label: "Social Links" }
];

async function ensureDefaults() {
  for (const d of DEFAULTS) {
    await SectionSetting.updateOne({ key: d.key }, { $setOnInsert: d }, { upsert: true });
  }
}

// Public: get all section visibility settings
router.get("/", asyncHandler(async (req, res) => {
  await ensureDefaults();
  const data = await SectionSetting.find().sort({ key: 1 }).lean();
  res.json({ success: true, data });
}));

// Admin: toggle a section on/off
router.patch("/:key", protect, asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  if (typeof isActive !== "boolean") throw new HttpError(400, "isActive must be a boolean");
  const doc = await SectionSetting.findOneAndUpdate(
    { key: req.params.key },
    { isActive },
    { new: true, upsert: true }
  );
  res.json({ success: true, data: doc });
}));

module.exports = router;
