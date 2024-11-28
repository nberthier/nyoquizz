import { db } from '@/db';
import { InsertUser } from '@/db/schema';
import { users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function deleteUser(id: string) {
  return await db.delete(users).where(eq(users.id, id));
}

export async function findAllUsers() {
  return await db.query.users.findMany();
}

export async function findUserById(id: string) {
  return await db.query.users.findFirst({
    where: (users) => eq(users.id, id),
  });
}

export async function insertUser(user: InsertUser) {
  return await db.insert(users).values(user);
}

export async function updateUserAge(id: string, age: number) {
  return await db
    .update(users)
    .set({ age, updatedAt: sql`NOW()` })
    .where(eq(users.id, id))
    .returning({ updatedAge: users.age });
}

export async function updateUserName(id: string, name: string) {
  return await db
    .update(users)
    .set({ name, updatedAt: sql`NOW()` })
    .where(eq(users.id, id))
    .returning({ updatedName: users.name });
}

export async function updateUserUsername(id: string, username: string) {
  return await db
    .update(users)
    .set({ updatedAt: sql`NOW()`, username })
    .where(eq(users.id, id))
    .returning({ updatedUsername: users.username });
}
