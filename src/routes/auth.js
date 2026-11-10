const express = require("express");
const { body } = require("express-validator");
const ctrl = require("../controllers/authController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post(
  "/login",
  loginLimiter,
  [
    body("email").trim().isEmail().withMessage("Enter a valid email").toLowerCase(),
    body("password").isString().notEmpty().withMessage("Password is required")
  ],
  validate,
  ctrl.login
);

router.get("/me", protect, ctrl.me);

router.put(
  "/password",
  protect,
  [
    body("currentPassword").isString().notEmpty().withMessage("Current password is required"),
    body("newPassword").isString().isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
  ],
  validate,
  ctrl.changePassword
);

module.exports = router;
