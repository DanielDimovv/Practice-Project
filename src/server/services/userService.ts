import { db } from "../db/client";
import { usersTable, SelectUser, InsertUser } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function createUser(data: InsertUser): Promise<SelectUser> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const result = await db
    .insert(usersTable)
    .values({ ...data, password: hashedPassword })
    .returning();
  return result[0];
}

export async function getUserById(id: number): Promise<SelectUser | undefined> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id));

  return user;
}

export async function getUserByEmail(
  email: string
): Promise<SelectUser | undefined> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<SelectUser | null> {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return user;
}

export async function getAllUsers(): Promise<SelectUser[]> {
  const users = await db.select().from(usersTable);
  return users;
}

export async function updateUser(
  id: number,
  data: Partial<InsertUser>
): Promise<SelectUser | undefined> {
  const [updatedUser] = await db
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.id, id))
    .returning();
  return updatedUser;
}

export async function deleteUser(id: number): Promise<boolean> {
  const [deleted] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning();
  return deleted !== undefined;
}
