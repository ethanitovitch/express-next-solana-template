import {
  findByReferralCodeSlug,
  update,
} from "@/repositories/user.repository";
import { DBUser } from "@shared/db/src";
import { generateReferralCode } from "@/utils/referrals";
import { generateSlug } from "@/utils/slug";

export const updateOrCreateReferralCode = async (user: DBUser, referralCode: string) => {
  const isValid = await validateReferralCode(user, referralCode);
  if (!isValid) {
    throw new Error("Invalid referral code");
  }
  await update(user.id, { referralCode, referralCodeSlug: generateSlug(referralCode) });

  return user;
};

export const generateUniqueReferralCode = async () => {
  let referralCode = generateReferralCode();

  while (!(await isReferralCodeUnique(referralCode))) {
    referralCode = generateReferralCode();
  }

  return referralCode;
};

export const validateReferralCode = async (user: DBUser, referralCode: string) => {
  const isUnique = await isReferralCodeUnique(referralCode);
  const isValid = isValidReferralCode(referralCode);
  return isUnique && isValid;
};

export const isReferralCodeUnique = async (referralCode: string) => {
  const referral = await findByReferralCodeSlug(generateSlug(referralCode));
  return referral === undefined || referral === null;
};

export const isValidReferralCode = (referralCode: string) => {
  // min 4, max 10 characters, alphanumeric, case insensitive
  return /^[a-zA-Z0-9]{4,10}$/.test(referralCode);
}