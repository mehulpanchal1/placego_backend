const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { HttpError, asyncHandler } = require("./error");

// Requires a valid "Authorization: Bearer <token>" header
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Not authorised: token missing");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new HttpError(401, "Not authorised: token invalid or expired");
  }
  const admin = await Admin.findById(payload.id);
  if (!admin) throw new HttpError(401, "Not authorised: account not found");
  req.admin = admin;
  next();
});

// Attaches req.admin if a valid token is present, otherwise continues as public
const optionalAuth = (req, res, next) => {
  if (!req.headers.authorization) return next();
  protect(req, res, (err) => (err ? next() : next()));
};

module.exports = { protect, optionalAuth };
