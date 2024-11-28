import 'dotenv/config';
import * as schema from '@/db/schema';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
  authToken: process.env.TURSO_AUTH_TOKEN!,
  url: process.env.TURSO_DATABASE_URL!,
});

export const db = drizzle(client, { schema });
