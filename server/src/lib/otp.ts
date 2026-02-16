import crypto from "crypto";

export function generateOtp6() {
  // 000000-999999 inclusive, left padded.
  const n = crypto.randomInt(0, 1_000_000);
  return String(n).padStart(6, "0");
}

export function makeOtpHash(otp: string, salt: string) {
  return crypto.createHash("sha256").update(`${otp}:${salt}`).digest("hex");
}

export function randomSalt(bytes = 16) {
  return crypto.randomBytes(bytes).toString("hex");
}
