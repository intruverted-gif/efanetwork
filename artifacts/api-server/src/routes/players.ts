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
      .eq('user_id', userId)
      .limit(50);

    if (playerError || !playerRows || playerRows.length === 0) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    const player = playerRows[0];

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
    const teamName = games.length > 0 ? games[0].myTeamName : null;

    // 4. Career totals
    const totalsRes = await pool.query(`
      SELECT
        COALESCE(SUM((mp.passing->>'completions')::int), 0)   AS pass_completions,
        COALESCE(SUM((mp.passing->>'attempts')::int), 0)      AS pass_attempts,
        COALESCE(SUM((mp.passing->>'yards')::int), 0)         AS pass_yards,
        COALESCE(SUM((mp.passing->>'tds')::int), 0)           AS pass_tds,
        COALESCE(SUM((mp.passing->>'ints')::int), 0)          AS pass_ints,
        COALESCE(SUM((mp.rushing->>'carries')::int), 0)       AS rush_carries,
        COALESCE(SUM((mp.rushing->>'yards')::int), 0)         AS rush_yards,
        COALESCE(SUM((mp.rushing->>'tds')::int), 0)           AS rush_tds,
        COALESCE(SUM((mp.receiving->>'receptions')::int), 0)  AS rec_receptions,
        COALESCE(SUM((mp.receiving->>'yards')::int), 0)       AS rec_yards,
        COALESCE(SUM((mp.receiving->>'tds')::int), 0)         AS rec_tds,
        COALESCE(SUM((mp.defense->>'tackles')::int), 0)       AS def_tackles,
        COALESCE(SUM((mp.defense->>'interceptions')::int), 0) AS def_ints,
        COALESCE(SUM((mp.defense->>'sacks')::int), 0)         AS def_sacks,
        COUNT(DISTINCT mp.match_id)                            AS games_played
      FROM match_participants mp
      WHERE mp.user_id = $1
    `, [userId]);

    const t = totalsRes.rows[0];
    const careerTotals = {
      gamesPlayed: parseInt(t.games_played, 10),
      passing: {
        completions: parseInt(t.pass_completions, 10),
        attempts:    parseInt(t.pass_attempts, 10),
        yards:       parseInt(t.pass_yards, 10),
        tds:         parseInt(t.pass_tds, 10),
        ints:        parseInt(t.pass_ints, 10),
      },
      rushing: {
        carries: parseInt(t.rush_carries, 10),
        yards:   parseInt(t.rush_yards, 10),
        tds:     parseInt(t.rush_tds, 10),
      },
      receiving: {
        receptions: parseInt(t.rec_receptions, 10),
        yards:      parseInt(t.rec_yards, 10),
        tds:        parseInt(t.rec_tds, 10),
      },
      defense: {
        tackles:       parseInt(t.def_tackles, 10),
        interceptions: parseInt(t.def_ints, 10),
        sacks:         parseInt(t.def_sacks, 10),
      },
    };

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
