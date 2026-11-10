const { validationResult } = require("express-validator");

// Run after express-validator chains; returns 400 with field errors
module.exports = function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  res.status(400).json({
    success: false,
    message: "Please check the highlighted fields",
    errors: result.array().map((e) => ({ field: e.path, message: e.msg }))
  });
};
