const mongoose = require("mongoose");
const dns = require("node:dns");
const User = require("../features/users/User");

const USER_INDEXES = [
  {
    key: { firebaseUid: 1 },
    options: {
      unique: true,
      partialFilterExpression: { firebaseUid: { $type: "string" } },
      name: "firebaseUid_1",
    },
  },
  {
    key: { id: 1 },
    options: {
      unique: true,
      partialFilterExpression: { id: { $type: "string" } },
      name: "id_1",
    },
  },
];

async function ensureUserIndexes() {
  let indexes = [];
  try {
    indexes = await User.collection.indexes();
  } catch (error) {
    // A new database has no users collection yet; createIndex below creates it.
    if (error?.code !== 26 && error?.codeName !== "NamespaceNotFound") throw error;
  }

  for (const { key, options } of USER_INDEXES) {
    const existing = indexes.find((index) =>
      JSON.stringify(Object.entries(index.key)) === JSON.stringify(Object.entries(key))
    );
    const matches = existing?.unique === true &&
      JSON.stringify(existing.partialFilterExpression) === JSON.stringify(options.partialFilterExpression);

    if (existing && !matches) {
      await User.collection.dropIndex(existing.name);
    }
    if (!matches) {
      await User.collection.createIndex(key, options);
    }
  }
}

async function connectDatabase() {
  const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,8.8.4.4")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);
  if (dnsServers.length) dns.setServers(dnsServers);

  await mongoose.connect(process.env.MONGO_URI, { family: 4 });
  await ensureUserIndexes();
  console.log("MongoDB 연결 및 사용자 인덱스 확인 성공!");
}

module.exports = { connectDatabase };
