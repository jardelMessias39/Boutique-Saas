import { account, ID } from "@/lib/appwrite";
import type { Models } from "appwrite";

export async function getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  return account.createEmailPasswordSession({ email, password });
}

export async function register(name: string, email: string, password: string) {
  await account.create({ userId: ID.unique(), email, password, name });
  return login(email, password);
}

export async function logout() {
  await account.deleteSession({ sessionId: "current" });
}
