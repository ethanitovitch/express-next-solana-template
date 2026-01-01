import { db } from '@/lib/db'
import { withIdAndTimestamps, withTimestamps } from '@/repositories/utils'
import { DBUser, InsertDBUser } from '@shared/db/src'
import { REFERRAL_DEFAULT_BASIS_POINTS } from '@shared/types/src'

export async function findByPublicKey(
  publicKey: string,
): Promise<DBUser | undefined> {
  return await db
    .selectFrom("user")
    .selectAll()
    .where("publicKey", "=", publicKey)
    .executeTakeFirst();
}

export async function findByUsernameSlug(usernameSlug: string): Promise<DBUser | undefined> {
  return await db
    .selectFrom("user")
    .selectAll()
    .where("usernameSlug", "=", usernameSlug)
    .executeTakeFirst();
}

export async function findById(id: string): Promise<DBUser | undefined> {
  return db
    .selectFrom("user")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function create(user: Omit<InsertDBUser, "id" | "createdAt" | "updatedAt">): Promise<DBUser> {
  return db
    .insertInto("user")
    .values(withIdAndTimestamps({
      ...user,
      isAdmin: false, 
      isChatModerator: false,
      referralBasisPoints: REFERRAL_DEFAULT_BASIS_POINTS,
      isStreamer: false,
      isBanned: false,
    }, true))
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function update(
  id: string,
  data: Partial<DBUser>,
): Promise<DBUser> {
  return db
    .updateTable("user")
    .set(withTimestamps(data, false))
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export const findByReferralCodeSlug = async (referralCodeSlug: string) => {
  return db
    .selectFrom("user")
    .selectAll()
    .where("referralCodeSlug", "=", referralCodeSlug)
    .executeTakeFirst();
};