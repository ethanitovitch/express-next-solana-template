import { Selectable, Insertable, Updateable } from "kysely";
import {
  User,
  Example,
  Notification,
} from "./generated/types";


export type DBUser = Selectable<User>;
export type UpdateDBUser = Updateable<User>;
export type InsertDBUser = Insertable<User>;

export type DBExample = Selectable<Example>;
export type UpdateDBExample = Updateable<Example>;
export type InsertDBExample = Insertable<Example>;

export type DBNotification = Selectable<Notification>;
export type UpdateDBNotification = Updateable<Notification>;
export type InsertDBNotification = Insertable<Notification>;
export type CreateNotificationInput = Omit<DBNotification, 'id' | 'createdAt' | 'updatedAt'>;

export type DBPagination = {
  page: number;
  limit: number;
  offset: number;
};