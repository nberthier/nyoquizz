import { db } from '@/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth, { NextAuthConfig } from 'next-auth';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';

export const authConfig = {
  adapter: DrizzleAdapter(db),
  providers: [Discord, Google],
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
