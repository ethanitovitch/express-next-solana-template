import { DEFAULT_AVATAR_URLS } from "@shared/types/src";

export const getRandomAvatar = (): string => {
  const avatarUrls = Object.values(DEFAULT_AVATAR_URLS) as string[];
  return avatarUrls[Math.floor(Math.random() * avatarUrls.length)] || '';
};