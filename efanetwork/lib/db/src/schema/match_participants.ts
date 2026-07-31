import { pgTable, serial, text, bigint, jsonb } from 'drizzle-orm/pg-core';
import { matchesTable } from './matches';
import { playersTable } from './players';

// Stats blobs — only the keys the player recorded are present
export interface PassingStats {
  completions: number;
  attempts: number;
  yards: number;
  tds: number;
  ints: number;
  sacked?: number;
}
export interface RushingStats {
  carries: number;
  yards: number;
  tds: number;
}
export interface ReceivingStats {
  receptions: number;
  yards: number;
  tds: number;
}
export interface DefenseStats {
  tackles: number;
  interceptions: number;
}

export const matchParticipantsTable = pgTable('match_participants', {
  id: serial('id').primaryKey(),
  matchId: text('match_id')
    .notNull()
    .references(() => matchesTable.matchId, { onDelete: 'cascade' }),
  userId: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => playersTable.userId),
  teamSide: text('team_side').notNull(), // 'home' | 'away'
  teamName: text('team_name').notNull(),
  passing: jsonb('passing').$type<PassingStats>(),
  rushing: jsonb('rushing').$type<RushingStats>(),
  receiving: jsonb('receiving').$type<ReceivingStats>(),
  defense: jsonb('defense').$type<DefenseStats>(),
});

export type MatchParticipant = typeof matchParticipantsTable.$inferSelect;
export type InsertMatchParticipant = typeof matchParticipantsTable.$inferInsert;
