import type { Adapter } from 'next-auth/adapters';
import type { Provider } from 'next-auth/providers';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth, { NextAuthConfig } from 'next-auth';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';

const providers: Provider[] = [
  Discord({
    profile(profile) {
      return { role: profile.role ?? 'user', ...profile };
    },
  }),
  Google({
    profile(profile) {
      return { role: profile.role ?? 'user', ...profile };
    },
  }),
];

const authSchema = {
  ...schema,
  accountsTable: schema.accounts,
  usersTable: schema.users,
};

export const authConfig = {
  adapter: DrizzleAdapter(db, authSchema) as Adapter,
  callbacks: {
    session({ session }) {
      return session;
    },
  },
  providers,
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
