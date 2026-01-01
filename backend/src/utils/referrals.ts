import { randomBytes } from "crypto";
import { REFERRAL_CODE_LENGTH } from "@shared/types/src";

export const generateReferralCode = (
  length: number = REFERRAL_CODE_LENGTH,
): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
};