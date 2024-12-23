import type { AdapterAccountType } from 'next-auth/adapters';

import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  age: integer(),
  createdAt: integer(),
  email: text().notNull().unique(),
  emailVerified: integer({ mode: 'timestamp_ms' }),
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  image: text(),
  lastCompletedImagesSetId: text(),
  name: text().notNull(),
  role: text().default('user'),
  updatedAt: integer(),
  username: text(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  imageStats: many(imageStats),
  lastCompletedImagesSet: one(imagesSets, {
    fields: [users.lastCompletedImagesSetId],
    references: [imagesSets.id],
  }),
}));

export const images = sqliteTable(
  'image',
  {
    champion: text(),
    createdAt: integer(),
    game: text(),
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    imagesSetId: text(),
    indexInSet: integer(),
    link: text().notNull().unique(),
    type: text().notNull(),
    updatedAt: integer(),
  },
  (table) => ({
    unq: unique().on(table.imagesSetId, table.indexInSet),
  })
);

export const imagesRelations = relations(images, ({ one }) => ({
  imagesSet: one(imagesSets, {
    fields: [images.imagesSetId],
    references: [imagesSets.id],
  }),
}));

export const imagesSets = sqliteTable(
  'images_set',
  {
    createdAt: integer(),
    game: text().notNull(),
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    updatedAt: integer(),
  },
  (table) => ({
    dateOfCreationIndex: index('date_of_creation_index').on(table.createdAt),
  })
);

export const imagesSetsRelations = relations(imagesSets, ({ many }) => ({
  images: many(images),
}));

export const imageStats = sqliteTable(
  'image_stat',
  {
    createdAt: integer(),
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    imageId: text().notNull(),
    isResolved: integer({ mode: 'boolean' }).notNull(),
    numberOfTries: integer().notNull(),
    updatedAt: integer(),
    userId: text().notNull(),
  },
  (table) => ({
    unq: unique().on(table.imageId, table.userId),
  })
);

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

export const gameSessions = sqliteTable(
  'game_session',
  {
    createdAt: integer(),
    imagesSetId: text().notNull(),
    progression: integer().notNull(),
    updatedAt: integer(),
    userId: text().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.imagesSetId, table.userId] }),
  })
);

export const gameSessionsRelations = relations(gameSessions, ({ one }) => ({
  imagesSet: one(imagesSets, {
    fields: [gameSessions.imagesSetId],
    references: [imagesSets.id],
  }),
  user: one(users, {
    fields: [gameSessions.userId],
    references: [users.id],
  }),
}));

export const accounts = sqliteTable(
  'account',
  {
    access_token: text(),
    expires_at: integer(),
    id_token: text(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refresh_token: text(),
    scope: text(),
    session_state: text(),
    token_type: text(),
    type: text().$type<AdapterAccountType>().notNull(),
    userId: text()
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
  expires: integer({ mode: 'timestamp_ms' }).notNull(),
  sessionToken: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    expires: integer({ mode: 'timestamp_ms' }).notNull(),
    identifier: text().notNull(),
    token: text().notNull(),
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
    counter: integer().notNull(),
    credentialBackedUp: integer({
      mode: 'boolean',
    }).notNull(),
    credentialDeviceType: text().notNull(),
    credentialID: text().notNull().unique(),
    credentialPublicKey: text().notNull(),
    providerAccountId: text().notNull(),
    transports: text(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export type GameSession = typeof gameSessions.$inferSelect;
export type Image = typeof images.$inferSelect;
export type ImagesSet = typeof imagesSets.$inferSelect;
export type ImageStat = typeof imageStats.$inferSelect;
export type InsertGameSession = typeof gameSessions.$inferInsert;
export type InsertImage = typeof images.$inferInsert;
export type InsertImagesSet = typeof imagesSets.$inferInsert;
export type InsertImageStat = typeof imageStats.$inferInsert;
export type InsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
