require("dotenv").config();
const mongoose = require("mongoose");

async function scrubLegacyPasswords() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI 환경변수가 필요합니다.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const users = mongoose.connection.db.collection("users");
  const filter = { password: { $exists: true } };
  const count = await users.countDocuments(filter);

  if (process.argv.includes("--apply")) {
    const result = await users.updateMany(filter, {
      $unset: { password: "" },
    });
    console.log(`Removed password fields from ${result.modifiedCount} legacy user records.`);
  } else {
    console.log(`${count} legacy user records contain password fields.`);
    console.log("Dry run only. Re-run with --apply after backing up and confirming migration.");
  }

  await mongoose.disconnect();
}

scrubLegacyPasswords().catch(async (error) => {
  console.error("Legacy password cleanup failed:", error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
