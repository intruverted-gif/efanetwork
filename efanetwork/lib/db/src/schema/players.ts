import { pgTable, bigint, text, timestamp } from 'drizzle-orm/pg-core';

export const playersTable = pgTable('players', {
  userId: bigint('user_id', { mode: 'number' }).primaryKey(),
  displayName: text('display_name').notNull(),
  headshotUrl: text('headshot_url'),
  headshotRefreshedAt: timestamp('headshot_refreshed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Player = typeof playersTable.$inferSelect;
export type InsertPlayer = typeof playersTable.$inferInsert;
