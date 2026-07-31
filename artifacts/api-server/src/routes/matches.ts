import { Router, type IRouter } from 'express';
import { z } from 'zod';
import { pool } from '@workspace/db';

const router: IRouter = Router();

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generate a stable pseudo user-id from a player display name.
 * Uses a negative DJB2 hash so it never collides with real Roblox user IDs
 * (which are always positive integers).
 */
function pseudoUserId(name: string): number {
  let hash = 5381;
  for (let i = 0; i < name.length; i++) {
    hash = Math.imul((hash << 5) + hash, 1) + name.charCodeAt(i);
    hash |= 0; // keep 32-bit signed
  }
  return -(Math.abs(hash) || 1); // always negative, never zero
}

const PLAYER_NAME_ALIASES: Record<string, string> = {
  touchcenim: 'touchdenim',
};

function canonicalPlayerName(name: string): string {
  return PLAYER_NAME_ALIASES[name.trim().toLowerCase()] ?? name.trim();
}

async function resolveRobloxPlayer(name: string, suppliedUserId: number | null) {
  const canonicalName = canonicalPlayerName(name);
  let userId = suppliedUserId;
  let username = canonicalName;

  try {
    if (userId == null) {
      const lookup = await fetch('https://users.roblox.com/v1/usernames/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames: [canonicalName], excludeBannedUsers: false }),
      });
      if (lookup.ok) {
        const body = await lookup.json() as { data?: Array<{ id: number; name: string }> };
        const match = body.data?.[0];
        if (match) {
          userId = match.id;
          username = match.name;
        }
      }
    }

    if (userId != null && userId > 0) {
      const thumbnails = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
      );
      if (thumbnails.ok) {
        const body = await thumbnails.json() as { data?: Array<{ imageUrl?: string }> };
        return {
          userId,
          displayName: username,
          headshotUrl: body.data?.[0]?.imageUrl ?? null,
          isReal: true,
        };
      }
      return { userId, displayName: username, headshotUrl: null, isReal: true };
    }
  } catch (error) {
    console.warn(`[roblox] Could not resolve "${canonicalName}"`, error);
  }

  return {
    userId: pseudoUserId(canonicalName),
    displayName: canonicalName,
    headshotUrl: null,
    isReal: false,
  };
}

// ── Payload schema ──────────────────────────────────────────────────────────

const PlayerSchema = z.object({
  name: z.string(),
  userId: z.number().nullable(),
  headshotUrl: z.string().nullable(),
  passing: z.object({
    completions: z.number(), attempts: z.number(),
    yards: z.number(), tds: z.number(), ints: z.number(),
    sacked: z.number().optional(),
  }).optional(),
  rushing: z.object({
    carries: z.number(), yards: z.number(), tds: z.number(),
  }).optional(),
  receiving: z.object({
    receptions: z.number(), yards: z.number(), tds: z.number(),
  }).optional(),
  defense: z.object({
    tackles: z.number(), interceptions: z.number(), sacks: z.number(),
  }).optional(),
});

const TeamSchema = z.object({
  teamName: z.string(),
  score: z.number(),
  players: z.array(PlayerSchema),
});

const ImportPayloadSchema = z.object({
  matchId: z.string().min(1),
  exportedAt: z.string().datetime({ offset: true }),
  season: z.number().int().min(1).max(9).default(3),
  homeTeam: TeamSchema,
  awayTeam: TeamSchema,
});

// ── Auth middleware ──────────────────────────────────────────────────────────

function requireApiKey(req: any, res: any, next: any) {
  const apiKey = process.env.EXPORT_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server misconfiguration: EXPORT_API_KEY not set' });
    return;
  }
  const auth = req.headers['authorization'] as string | undefined;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing Authorization header' });
    return;
  }
  const token = auth.slice(7);
  if (token !== apiKey) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }
  next();
}

// ── POST /api/matches/import ─────────────────────────────────────────────────

router.post('/matches/import', requireApiKey, async (req, res) => {
  const parse = ImportPayloadSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
    return;
  }

  const { matchId, exportedAt, season, homeTeam, awayTeam } = parse.data;
  const passingPlayerCount =
    homeTeam.players.filter((player) => player.passing).length +
    awayTeam.players.filter((player) => player.passing).length;

  if (passingPlayerCount === 0) {
    res.status(400).json({
      error: 'No passing stats were included in this export',
      details: 'Update the Discord embed parser to support the current Passing rows, including the SACKED column, then export again.',
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Upsert match (idempotent)
    await client.query(`
      INSERT INTO matches (match_id, season, home_team_name, away_team_name, home_score, away_score, exported_at, imported_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (match_id) DO UPDATE SET
        season = EXCLUDED.season,
        home_team_name = EXCLUDED.home_team_name,
        away_team_name = EXCLUDED.away_team_name,
        home_score = EXCLUDED.home_score,
        away_score = EXCLUDED.away_score,
        exported_at = EXCLUDED.exported_at,
        imported_at = NOW()
    `, [matchId, season, homeTeam.teamName, awayTeam.teamName,
        homeTeam.score, awayTeam.score, exportedAt]);

    // 2. Delete existing participants (so re-import doesn't double-count)
    await client.query('DELETE FROM match_participants WHERE match_id = $1', [matchId]);

    // 3. Process each team's players
    const teams = [
      { team: homeTeam, side: 'home' },
      { team: awayTeam, side: 'away' },
    ];

    let savedCount = 0;
    const pseudoIdPlayers: string[] = [];

    for (const { team, side } of teams) {
      for (const player of team.players) {
        // Resolve userId: use real ID if provided, otherwise derive a stable
        // pseudo-ID from the player name (negative so it never collides with
        // real Roblox IDs which are always positive).
        const identity = await resolveRobloxPlayer(player.name, player.userId);
        const resolvedUserId = identity.userId;
        const isReal = identity.isReal;

        if (!isReal) {
          console.warn(`[import:${matchId}] Player "${player.name}" could not be resolved — using pseudo-id ${resolvedUserId}`);
        }

        // 3a. Upsert player record
        await client.query(`
          INSERT INTO players (user_id, display_name, headshot_url, headshot_refreshed_at, created_at, updated_at)
          VALUES ($1, $2, $3, NOW(), NOW(), NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            headshot_url = COALESCE(EXCLUDED.headshot_url, players.headshot_url),
            headshot_refreshed_at = CASE WHEN EXCLUDED.headshot_url IS NOT NULL THEN NOW() ELSE players.headshot_refreshed_at END,
            updated_at = NOW()
        `, [resolvedUserId, identity.displayName, player.headshotUrl ?? identity.headshotUrl]);

        // 3b. Insert participant row
        await client.query(`
          INSERT INTO match_participants (match_id, user_id, team_side, team_name, passing, rushing, receiving, defense)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          matchId,
          resolvedUserId,
          side,
          team.teamName,
          player.passing ? JSON.stringify(player.passing) : null,
          player.rushing ? JSON.stringify(player.rushing) : null,
          player.receiving ? JSON.stringify(player.receiving) : null,
          player.defense ? JSON.stringify(player.defense) : null,
        ]);

        savedCount++;
        if (!isReal) pseudoIdPlayers.push(player.name);
      }
    }

    if (pseudoIdPlayers.length > 0) {
      console.warn(`[import:${matchId}] ${pseudoIdPlayers.length} player(s) saved with pseudo-ids: ${pseudoIdPlayers.join(', ')}`);
    }

    await client.query('COMMIT');
    res.json({
      ok: true,
      matchId,
      savedCount,
      pseudoIdCount: pseudoIdPlayers.length,
      pseudoIdPlayers: pseudoIdPlayers.length > 0 ? pseudoIdPlayers : undefined,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Import error:', err);
    res.status(500).json({ error: 'Internal server error during import' });
  } finally {
    client.release();
  }
});

// ── GET /api/matches/:matchId ────────────────────────────────────────────────

router.get('/matches/:matchId', async (req, res) => {
  const { matchId } = req.params;

  const matchRes = await pool.query(
    'SELECT * FROM matches WHERE match_id = $1',
    [matchId]
  );
  if (matchRes.rows.length === 0) {
    res.status(404).json({ error: 'Match not found' });
    return;
  }
  const match = matchRes.rows[0];

  const participantsRes = await pool.query(`
    SELECT mp.*, p.display_name, p.headshot_url
    FROM match_participants mp
    JOIN players p ON p.user_id = mp.user_id
    WHERE mp.match_id = $1
    ORDER BY mp.team_side, mp.id
  `, [matchId]);

  res.json({
    matchId: match.match_id,
    season: match.season,
    exportedAt: match.exported_at,
    homeTeamName: match.home_team_name,
    awayTeamName: match.away_team_name,
    homeScore: match.home_score,
    awayScore: match.away_score,
    players: participantsRes.rows.map((r) => ({
      userId: r.user_id,
      displayName: r.display_name,
      headshotUrl: r.headshot_url,
      teamSide: r.team_side,
      teamName: r.team_name,
      passing: r.passing,
      rushing: r.rushing,
      receiving: r.receiving,
      defense: r.defense,
    })),
  });
});

// ── GET /api/matches ─────────────────────────────────────────────────────────

router.get('/matches', async (_req, res) => {
  const result = await pool.query(
    'SELECT * FROM matches ORDER BY exported_at DESC LIMIT 100'
  );
  res.json(result.rows.map((r) => ({
    matchId: r.match_id,
    season: r.season,
    homeTeamName: r.home_team_name,
    awayTeamName: r.away_team_name,
    homeScore: r.home_score,
    awayScore: r.away_score,
    exportedAt: r.exported_at,
  })));
});

export default router;
