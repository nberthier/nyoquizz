import type { AdapterAccountType } from 'next-auth/adapters';

import { relations } from 'drizzle-orm';
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  age: integer('age').notNull(),
  createdAt: integer('created_at'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  image: text('image'),
  name: text('name').notNull(),
  updatedAt: integer('updated_at'),
  username: text('username').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  imageStats: many(imageStats),
}));

export const images = sqliteTable('image', {
  champion: text('champion'),
  createdAt: integer('created_at'),
  difficulty: text('difficulty').notNull(),
  game: text('game'),
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  link: text('link').notNull().unique(),
  type: text('type').notNull(),
  updatedAt: integer('updated_at'),
});

export const imageStats = sqliteTable('image_stat', {
  createdAt: integer('created_at'),
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  imageId: integer('image').notNull(),
  numberOfTries: integer('number_of_tries').notNull(),
  updatedAt: integer('updated_at'),
  userId: text('user').notNull(),
});

export const imageStatsRelations = relations(imageStats, ({ one }) => ({
  image: one(images, {
    fields: [imageStats.imageId],
    references: [images.id],
  }),
  user: one(users, {
    fields: [imageStats.userId],
    references: [users.id],
  }),
}));

export const accounts = sqliteTable(
  'account',
  {
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    id_token: text('id_token'),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    scope: text('scope'),
    session_state: text('session_state'),
    token_type: text('token_type'),
    type: text('type').$type<AdapterAccountType>().notNull(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable('session', {
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = sqliteTable(
  'authenticator',
  {
    counter: integer('counter').notNull(),
    credentialBackedUp: integer('credentialBackedUp', {
      mode: 'boolean',
    }).notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialID: text('credentialID').notNull().unique(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    transports: text('transports'),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export type InsertImage = typeof images.$inferInsert;
export type InsertImageStat = typeof imageStats.$inferInsert;
export type InsertUser = typeof users.$inferInsert;
export type SelectImage = typeof images.$inferSelect;
export type SelectImageStat = typeof imageStats.$inferSelect;
export type SelectUser = typeof users.$inferSelect;
