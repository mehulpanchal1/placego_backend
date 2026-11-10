const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { asyncHandler, HttpError } = require("../middleware/error");

const sign = (admin) =>
  jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const publicAdmin = (a) => ({ id: a._id, name: a.name, email: a.email, lastLoginAt: a.lastLoginAt });

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.matchPassword(password))) {
    throw new HttpError(401, "Incorrect email or password");
  }
  admin.lastLoginAt = new Date();
  await admin.save();
  res.json({ success: true, token: sign(admin), admin: publicAdmin(admin) });
});

// GET /api/auth/me
exports.me = (req, res) => res.json({ success: true, admin: publicAdmin(req.admin) });

// PUT /api/auth/password
exports.changePassword = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("+password");
  if (!(await admin.matchPassword(req.body.currentPassword))) {
    throw new HttpError(400, "Current password is incorrect");
  }
  admin.password = req.body.newPassword;
  await admin.save();
  res.json({ success: true, message: "Password updated", token: sign(admin) });
});
