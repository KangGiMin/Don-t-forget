const { promisify } = require('node:util');
const { randomBytes, scrypt, timingSafeEqual } = require('node:crypto');
const scryptAsync = promisify(scrypt);

const PASSWORD_KEY_LENGTH = 64;

const hashPassword = async (password) => {
  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, PASSWORD_KEY_LENGTH);
  return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
};

const verifyPassword = async (password, storedPassword) => {
  if (typeof storedPassword !== "string") return false;

  if (storedPassword.startsWith("scrypt$")) {
    const [, saltHex, keyHex] = storedPassword.split("$");
    if (!saltHex || !keyHex || !/^[a-f0-9]+$/i.test(saltHex) || !/^[a-f0-9]+$/i.test(keyHex)) return false;

    const expectedKey = Buffer.from(keyHex, "hex");
    if (expectedKey.length !== PASSWORD_KEY_LENGTH) return false;

    const actualKey = await scryptAsync(password, Buffer.from(saltHex, "hex"), expectedKey.length);
    return timingSafeEqual(actualKey, expectedKey);
  }

  // 기존 평문 계정은 로그인이 성공한 순간 해시로 자동 전환합니다.
  const provided = Buffer.from(password, "utf8");
  const legacy = Buffer.from(storedPassword, "utf8");
  return provided.length === legacy.length && timingSafeEqual(provided, legacy);
};

module.exports = { hashPassword, verifyPassword };