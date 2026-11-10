/**
 * Creates (or resets the password of) the admin account from .env:
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
 * Usage: npm run create-admin
 */
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

(async () => {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
    process.exit(1);
  }
  if (ADMIN_PASSWORD.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  let admin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (admin) {
    admin.password = ADMIN_PASSWORD;
    if (ADMIN_NAME) admin.name = ADMIN_NAME;
    await admin.save();
    console.log("Admin password reset for", admin.email);
  } else {
    admin = await Admin.create({ name: ADMIN_NAME || "Admin", email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    console.log("Admin created:", admin.email);
  }
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
