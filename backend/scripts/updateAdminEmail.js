require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    const result = await Admin.updateOne(
      { email: "favourhsjshs@gmail.com" },
      { $set: { email: "reservations@discoverysamal-resort.org" } },
    );
    console.log("Updated:", result.modifiedCount, "document(s)");
    await mongoose.disconnect();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
