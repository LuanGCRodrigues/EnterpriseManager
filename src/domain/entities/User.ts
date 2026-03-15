export interface User {
  id: string;
  username: string;
  name: string;
  passwordHash: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export type CreateUserDTO = Omit<
  User,
  "id" | "passwordHash" | "createdAt" | "updatedAt"
> & {
  password: string;
};

export type UserProfile = Omit<User, "passwordHash">;
