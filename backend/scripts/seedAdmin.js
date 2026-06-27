require("dotenv").config();

const connectDB = require("../config/db");
const authService = require("../services/authService");

async function main() {
  const [, , email, password, ...nameParts] = process.argv;

  if (!email || !password) {
    throw new Error(
      "Usage: node scripts/seedAdmin.js <email> <password> [name]",
    );
  }

  const name = nameParts.length > 0 ? nameParts.join(" ") : "Resort Owner";

  await connectDB();
  const admin = await authService.seed({ email, password, name });
  console.log(JSON.stringify(admin));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
