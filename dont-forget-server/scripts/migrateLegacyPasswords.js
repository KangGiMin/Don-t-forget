require("dotenv").config();
const mongoose = require("mongoose");
const { promisify } = require("node:util");
const { randomBytes, scrypt } = require("node:crypto");
const User = require("../src/features/users/User");

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

async function migrate() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be configured in the server environment.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  let migrated = 0;

  try {
    for await (const user of User.find().select("+password").cursor()) {
      if (typeof user.password !== "string" || user.password.startsWith("scrypt$")) continue;

      const previousValue = user.password;
      const passwordHash = await hashPassword(previousValue);
      const result = await User.updateOne(
        { _id: user._id, password: previousValue },
        { $set: { password: passwordHash } }
      );
      migrated += result.modifiedCount;
    }

    console.log(`Migrated ${migrated} legacy password record(s).`);
  } finally {
    await mongoose.disconnect();
  }
}

migrate().catch((error) => {
  console.error("Password migration failed.", error.message);
  process.exitCode = 1;
});

