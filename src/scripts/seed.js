/**
 * Loads starter content into empty collections.
 *   npm run seed            -> only fills collections that are empty
 *   npm run seed -- --force -> clears products/industries/clients/testimonials and reloads
 * Enquiries and admin accounts are never touched.
 */
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const data = require("./seedData");
const models = {
  products: require("../models/Product"),
  industries: require("../models/Industry"),
  clients: require("../models/Client"),
  testimonials: require("../models/Testimonial")
};

(async () => {
  const force = process.argv.includes("--force");
  await mongoose.connect(process.env.MONGODB_URI);
  for (const [key, Model] of Object.entries(models)) {
    if (force) await Model.deleteMany({});
    const count = await Model.countDocuments();
    if (count > 0) {
      console.log(`${key}: ${count} existing, skipped (use --force to replace)`);
      continue;
    }
    await Model.insertMany(data[key]);
    console.log(`${key}: inserted ${data[key].length}`);
  }
  await mongoose.disconnect();
  console.log("Seed complete.");
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
