import { findByPublicKey, create } from '@/repositories/user.repository';
import { generateUniqueReferralCode } from './referral.service';
import { generateSlug } from '@/utils/slug';
import { getRandomAvatar } from '@/utils/user';

export const getOrCreateUser = async (publicKey: string) => {
  const user = await findByPublicKey(publicKey);
  if (user) {
    return user;
  }

  const referralCode = await generateUniqueReferralCode();
  return create({
    publicKey,
    username: publicKey,
    usernameSlug: generateSlug(publicKey),
    avatar: getRandomAvatar(),
    referralCode,
    referralCodeSlug: generateSlug(referralCode),
  });
};