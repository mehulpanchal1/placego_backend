const rateLimit = require("express-rate-limit");

const json = (message) => ({ success: false, message });

// Contact form: 5 submissions per IP per 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many messages from this device. Please try again in 15 minutes.")
});

// Login: 10 attempts per IP per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many login attempts. Please try again in 15 minutes.")
});

module.exports = { contactLimiter, loginLimiter };
