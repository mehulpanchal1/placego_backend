const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const { notFound, errorHandler } = require("./middleware/error");
const resourceRouter = require("./routes/resource");
const Product = require("./models/Product");
const Industry = require("./models/Industry");
const Client = require("./models/Client");
const Testimonial = require("./models/Testimonial");
const SocialLink = require("./models/SocialLink");
const SectionSetting = require("./models/SectionSetting");

const app = express();

// Behind Nginx / Render / Railway / cPanel proxy: needed for correct client IPs in rate limiting
app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json({ limit: "100kb" }));

// ---------- CORS ----------
const allowed = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin(origin, cb) {
      // allow server-to-server tools (curl, Postman) and listed origins
      if (!origin || allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
      cb(new Error("Origin not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

if (process.env.NODE_ENV !== "test") app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ---------- Health ----------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    database: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown",
    uptime: Math.round(process.uptime()),
    time: new Date().toISOString()
  });
});

app.get("/", (req, res) => res.json({ success: true, message: "PlaceGo API. See /api/health" }));

// ---------- Routes ----------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/products", resourceRouter(Product));
app.use("/api/industries", resourceRouter(Industry));
app.use("/api/clients", resourceRouter(Client));
app.use("/api/testimonials", resourceRouter(Testimonial));
app.use("/api/social-links", resourceRouter(SocialLink));
app.use("/api/sections", require("./routes/sections"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
