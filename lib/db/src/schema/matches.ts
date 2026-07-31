import { pgTable, text, integer, timestamp, smallint } from 'drizzle-orm/pg-core';

export const matchesTable = pgTable('matches', {
  matchId: text('match_id').primaryKey(),
  season: smallint('season').notNull().default(3),
  homeTeamName: text('home_team_name').notNull(),
  awayTeamName: text('away_team_name').notNull(),
  homeScore: integer('home_score').notNull(),
  awayScore: integer('away_score').notNull(),
  exportedAt: timestamp('exported_at', { withTimezone: true }).notNull(),
  importedAt: timestamp('imported_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Match = typeof matchesTable.$inferSelect;
export type InsertMatch = typeof matchesTable.$inferInsert;
