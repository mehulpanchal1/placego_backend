/**
 * Generic CRUD router for website content (products, industries, clients, testimonials).
 *
 *   GET    /            public: visible items sorted by order
 *                       admin + ?all=true: every item including hidden ones
 *   GET    /:id         public: one visible item (admin: any item)
 *   POST   /            admin: create
 *   PUT    /:id         admin: update
 *   DELETE /:id         admin: delete
 */
const express = require("express");
const mongoose = require("mongoose");
const { protect, optionalAuth } = require("../middleware/auth");
const { asyncHandler, HttpError } = require("../middleware/error");

module.exports = function resourceRouter(Model) {
  const router = express.Router();

  // Only allow fields defined on the schema (blocks _id, timestamps, unknown keys)
  const editable = Object.keys(Model.schema.paths).filter(
    (p) => !["_id", "__v", "createdAt", "updatedAt"].includes(p) && !p.includes(".")
  );
  const pick = (body) =>
    Object.fromEntries(Object.entries(body || {}).filter(([k]) => editable.includes(k)));

  const checkId = (id) => {
    if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid id");
  };

  router.get(
    "/",
    optionalAuth,
    asyncHandler(async (req, res) => {
      const showAll = req.admin && req.query.all === "true";
      const data = await Model.find(showAll ? {} : { isActive: true })
        .sort({ order: 1, createdAt: 1 })
        .lean();
      res.set("Cache-Control", showAll ? "no-store" : "public, max-age=60");
      res.json({ success: true, count: data.length, data });
    })
  );

  router.get(
    "/:id",
    optionalAuth,
    asyncHandler(async (req, res) => {
      checkId(req.params.id);
      const filter = { _id: req.params.id, ...(req.admin ? {} : { isActive: true }) };
      const doc = await Model.findOne(filter).lean();
      if (!doc) throw new HttpError(404, Model.modelName + " not found");
      res.json({ success: true, data: doc });
    })
  );

  router.post(
    "/",
    protect,
    asyncHandler(async (req, res) => {
      const doc = await Model.create(pick(req.body));
      res.status(201).json({ success: true, data: doc });
    })
  );

  router.put(
    "/:id",
    protect,
    asyncHandler(async (req, res) => {
      checkId(req.params.id);
      const doc = await Model.findByIdAndUpdate(req.params.id, pick(req.body), {
        new: true,
        runValidators: true
      });
      if (!doc) throw new HttpError(404, Model.modelName + " not found");
      res.json({ success: true, data: doc });
    })
  );

  router.delete(
    "/:id",
    protect,
    asyncHandler(async (req, res) => {
      checkId(req.params.id);
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw new HttpError(404, Model.modelName + " not found");
      res.json({ success: true, message: Model.modelName + " deleted" });
    })
  );

  return router;
};
