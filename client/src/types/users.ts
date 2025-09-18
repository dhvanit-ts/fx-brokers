export interface User {
  _id: string;
  username: string;
  email: string;
  authProvider: "manual" | "google";
  createdAt: string;
  updatedAt: string;
}
