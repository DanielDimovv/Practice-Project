import { db } from "../db/client";
import { usersTable, SelectUser, InsertUser } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createActivity } from "./trackActivity";

export async function createUser(data: InsertUser): Promise<SelectUser> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const [result] = await db
    .insert(usersTable)
    .values({ ...data, password: hashedPassword })
    .returning();

    try{ await createActivity({ user_id: result.id, operation: "registered" }) }
    catch (error) { console.error("Failed to log registered activity:", error);} 
  return result;
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

  try {
    await createActivity({ user_id: user.id, operation: "login" });
  } catch (error) {
    console.error("Failed to log login activity:", error);
    
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
