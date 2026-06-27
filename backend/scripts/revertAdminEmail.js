require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    const result = await Admin.updateOne(
      { email: "reservations@discoverysamal-resort.org" },
      { $set: { email: "favourhsjshs@gmail.com" } },
    );
    console.log("Reverted:", result.modifiedCount, "document(s)");
    await mongoose.disconnect();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
