import { Router, type IRouter } from 'express';
import { createClient } from '@supabase/supabase-js';
import { pool } from '@workspace/db';

const router: IRouter = Router();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// ── GET /api/players/:userId ─────────────────────────────────────────────────
// Returns full player profile: info, career totals, and per-game log.

router.get('/players/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid userId' });
    return;
  }

  try {
    if (!supabase) {
      res.status(500).json({ error: 'Supabase configuration missing' });
      return;
    }

    // 1. Player stats rows for this user (use the available player_stats table)
    const { data: playerRows, error: playerError } = await supabase
      .from('player_stats')
      .select('user_id, display_name, headshot_url, category, season, team_name, completions, attempts, yards, tds, ints, carries, receptions, tackles, interceptions, sacks')
      .or(`user_id.eq.${userId},user_id.eq.${Number(userId)}`)
      .limit(200);

    if (playerError) {
      throw playerError;
    }

    const player = playerRows?.[0];
    const statsRows = playerRows ?? [];

    if (!player || statsRows.length === 0) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    // 2. All games for this player (ordered newest first)
    const gamesRes = await pool.query(`
      SELECT
        m.match_id,
        m.season,
        m.exported_at,
        m.home_team_name,
        m.away_team_name,
        m.home_score,
        m.away_score,
        mp.team_side,
        mp.team_name AS my_team_name,
        mp.passing,
        mp.rushing,
        mp.receiving,
        mp.defense
      FROM match_participants mp
      JOIN matches m ON m.match_id = mp.match_id
      WHERE mp.user_id = $1
      ORDER BY m.exported_at DESC
    `, [userId]);

    const games = gamesRes.rows.map((r) => {
      const isHome = r.team_side === 'home';
      const myScore = isHome ? r.home_score : r.away_score;
      const oppScore = isHome ? r.away_score : r.home_score;
      const oppName = isHome ? r.away_team_name : r.home_team_name;
      const won = myScore != null && oppScore != null ? myScore > oppScore : null;
      return {
        matchId: r.match_id,
        season: r.season,
        exportedAt: r.exported_at,
        myTeamName: r.my_team_name,
        myScore,
        opponentName: oppName,
        opponentScore: oppScore,
        won,
        passing: r.passing,
        rushing: r.rushing,
        receiving: r.receiving,
        defense: r.defense,
      };
    });

    // 3. Latest team (most recent game)
    const teamName = games.length > 0 ? games[0].myTeamName : (player.team_name ?? null);

    // 4. Career totals aggregated from the matching player_stats rows
    const careerTotals = statsRows.reduce((acc, row) => {
      const addValue = (value: unknown) => (typeof value === 'number' ? value : Number(value ?? 0));
      acc.gamesPlayed += 1;
      acc.passing.completions += addValue(row.completions);
      acc.passing.attempts += addValue(row.attempts);
      acc.passing.yards += addValue(row.yards);
      acc.passing.tds += addValue(row.tds);
      acc.passing.ints += addValue(row.ints);
      acc.rushing.carries += addValue(row.carries);
      acc.rushing.yards += addValue(row.yards);
      acc.rushing.tds += addValue(row.tds);
      acc.receiving.receptions += addValue(row.receptions);
      acc.receiving.yards += addValue(row.yards);
      acc.receiving.tds += addValue(row.tds);
      acc.defense.tackles += addValue(row.tackles);
      acc.defense.interceptions += addValue(row.interceptions);
      acc.defense.sacks += addValue(row.sacks);
      return acc;
    }, {
      gamesPlayed: 0,
      passing: { completions: 0, attempts: 0, yards: 0, tds: 0, ints: 0 },
      rushing: { carries: 0, yards: 0, tds: 0 },
      receiving: { receptions: 0, yards: 0, tds: 0 },
      defense: { tackles: 0, interceptions: 0, sacks: 0 },
    });

    res.json({
      userId: userId,
      displayName: player.display_name,
      headshotUrl: player.headshot_url,
      teamName,
      careerTotals,
      games,
    });
  } catch (err) {
    console.error('Player profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
