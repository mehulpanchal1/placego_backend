const express = require("express");
const { body, query, param } = require("express-validator");
const ctrl = require("../controllers/contactController");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { contactLimiter } = require("../middleware/rateLimit");

const router = express.Router();

// Public: website contact form
router.post(
  "/",
  contactLimiter,
  [
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be 2 to 100 characters"),
    body("email").trim().isEmail().withMessage("Enter a valid email address").isLength({ max: 150 }),
    body("phone").optional({ values: "falsy" }).trim().matches(/^[+\d][\d\s-]{6,19}$/).withMessage("Enter a valid phone number"),
    body("company").optional().trim().isLength({ max: 150 }),
    body("service").optional().trim().isLength({ max: 100 }),
    body("message").trim().isLength({ min: 10, max: 5000 }).withMessage("Message must be 10 to 5000 characters")
  ],
  validate,
  ctrl.create
);

// Admin only below
router.use(protect);

router.get("/stats", ctrl.stats);

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 1000 }).toInt(),
    query("status").optional().isIn(["new", "contacted", "closed"])
  ],
  validate,
  ctrl.list
);

router.get("/:id", [param("id").isMongoId().withMessage("Invalid id")], validate, ctrl.getOne);

router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid id"),
    body("status").optional().isIn(["new", "contacted", "closed"]).withMessage("Invalid status"),
    body("isRead").optional().isBoolean().toBoolean(),
    body("notes").optional().isString().isLength({ max: 2000 })
  ],
  validate,
  ctrl.update
);

router.delete("/:id", [param("id").isMongoId().withMessage("Invalid id")], validate, ctrl.remove);

module.exports = router;
