import type { ColumnType } from 'kysely'
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Example = {
  id: string
  name: string
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
}
export type Notification = {
  id: string
  userId: string
  title: string
  message: string
  link: string | null
  readAt: Timestamp | null
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
}
export type User = {
  id: string
  username: string | null
  usernameSlug: string | null
  publicKey: string
  avatar: string | null
  referralCode: string | null
  referralCodeSlug: string | null
  referralBasisPoints: Generated<number>
  isAdmin: Generated<boolean>
  isChatModerator: Generated<boolean>
  isBanned: Generated<boolean>
  canUpdateProfile: Generated<boolean>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
}
export type DB = {
  example: Example
  notification: Notification
  user: User
}
