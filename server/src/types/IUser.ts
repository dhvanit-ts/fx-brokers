import { Types } from "mongoose";

export type TAuthProvider ="manual" | "google"

export interface IUser {
  id: number;
  email: string;
  username: string;
  authProvider: TAuthProvider;
  refreshToken?: string
  password?: string | null
  createdAt?: Date;
  updatedAt?: Date;
}
