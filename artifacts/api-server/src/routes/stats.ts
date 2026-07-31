import { Router, type IRouter } from 'express';
import { createClient } from '@supabase/supabase-js';
import { pool } from '@workspace/db';

const router: IRouter = Router();

const VALID_CATEGORIES = ['passing', 'rushing', 'receiving', 'defense'] as const;
type Category = typeof VALID_CATEGORIES[number];

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// ── GET /api/stats?category=passing&season=all ───────────────────────────────
// Career totals computed on read by summing match_participant rows.
// season: 'all' | '1' | '2' | '3'

router.get('/stats', async (req, res) => {
  const category = req.query.category as string;
  const seasonParam = req.query.season as string;

  if (!VALID_CATEGORIES.includes(category as Category)) {
    res.status(400).json({ error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
    return;
  }

  const seasonNum = seasonParam && seasonParam !== 'all' ? parseInt(seasonParam, 10) : null;
  if (seasonParam && seasonParam !== 'all' && (isNaN(seasonNum!) || seasonNum! < 1)) {
    res.status(400).json({ error: 'season must be "all" or a positive integer' });
    return;
  }

  try {
    if (supabase) {
      const { data: rows, error } = await supabase
        .from('player_stats')
        .select('user_id, display_name, headshot_url, team_name, category, season, completions, attempts, yards, tds, ints, carries, receptions, tackles, interceptions, sacks')
        .eq('category', category);

      if (error) throw error;

      const filteredRows = (rows ?? []).filter((row: any) => {
        if (!seasonNum) return true;
        const seasonValue = row?.season;
        const normalized = String(seasonValue ?? '').trim().toLowerCase();
        return normalized === String(seasonNum) || normalized === `season ${seasonNum}`;
      });

      const groupedRows = new Map<string, any>();
      for (const row of filteredRows) {
        const key = `${row.user_id}:${row.category}:${String(row.season ?? '').trim().toLowerCase()}`;
        const existing = groupedRows.get(key);
        if (!existing) {
          groupedRows.set(key, {
            user_id: row.user_id,
            display_name: row.display_name,
            headshot_url: row.headshot_url,
            team_name: row.team_name,
            category: row.category,
            season: row.season,
            completions: Number(row.completions) || 0,
            attempts: Number(row.attempts) || 0,
            yards: Number(row.yards) || 0,
            tds: Number(row.tds) || 0,
            ints: Number(row.ints) || 0,
            carries: Number(row.carries) || 0,
            receptions: Number(row.receptions) || 0,
            tackles: Number(row.tackles) || 0,
            interceptions: Number(row.interceptions) || 0,
            sacks: Number(row.sacks) || 0,
          });
        } else {
          existing.completions += Number(row.completions) || 0;
          existing.attempts += Number(row.attempts) || 0;
          existing.yards += Number(row.yards) || 0;
          existing.tds += Number(row.tds) || 0;
          existing.ints += Number(row.ints) || 0;
          existing.carries += Number(row.carries) || 0;
          existing.receptions += Number(row.receptions) || 0;
          existing.tackles += Number(row.tackles) || 0;
          existing.interceptions += Number(row.interceptions) || 0;
          existing.sacks += Number(row.sacks) || 0;
          existing.team_name = row.team_name || existing.team_name;
        }
      }

      return res.json({ category, season: seasonParam || 'all', players: Array.from(groupedRows.values()) });
    }

    const seasonFilter = seasonNum ? 'AND m.season = $1' : '';
    const queryParams: any[] = seasonNum ? [seasonNum] : [];

    let selectCols: string;
    let havingClause: string;
    let orderCol: string;

    if (category === 'passing') {
      selectCols = `
        COALESCE(SUM((mp.passing->>'completions')::int), 0) AS completions,
        COALESCE(SUM((mp.passing->>'attempts')::int),    0) AS attempts,
        COALESCE(SUM((mp.passing->>'yards')::int),       0) AS yards,
        COALESCE(SUM((mp.passing->>'tds')::int),         0) AS tds,
        COALESCE(SUM((mp.passing->>'ints')::int),        0) AS ints,
        COALESCE(SUM((mp.passing->>'sacked')::int),      0) AS sacked
      `;
      havingClause = `HAVING
          COALESCE(SUM((mp.passing->>'yards')::int), 0) > 0
          OR COALESCE(SUM((mp.passing->>'tds')::int), 0) > 0`;
      orderCol = `COALESCE(SUM((mp.passing->>'yards')::int), 0) DESC`;
    } else if (category === 'rushing') {
      selectCols = `
        COALESCE(SUM((mp.rushing->>'carries')::int), 0) AS carries,
        COALESCE(SUM((mp.rushing->>'yards')::int),   0) AS yards,
        COALESCE(SUM((mp.rushing->>'tds')::int),     0) AS tds
      `;
      havingClause = `HAVING
          COALESCE(SUM((mp.rushing->>'yards')::int), 0) > 0
          OR COALESCE(SUM((mp.rushing->>'tds')::int), 0) > 0`;
      orderCol = `COALESCE(SUM((mp.rushing->>'yards')::int), 0) DESC`;
    } else if (category === 'receiving') {
      selectCols = `
        COALESCE(SUM((mp.receiving->>'receptions')::int), 0) AS receptions,
        COALESCE(SUM((mp.receiving->>'yards')::int),      0) AS yards,
        COALESCE(SUM((mp.receiving->>'tds')::int),        0) AS tds
      `;
      havingClause = `HAVING
          COALESCE(SUM((mp.receiving->>'yards')::int), 0) > 0
          OR COALESCE(SUM((mp.receiving->>'tds')::int), 0) > 0`;
      orderCol = `COALESCE(SUM((mp.receiving->>'yards')::int), 0) DESC`;
    } else {
      selectCols = `
        COALESCE(SUM((mp.defense->>'tackles')::int),       0) AS tackles,
        COALESCE(SUM((mp.defense->>'interceptions')::int), 0) AS interceptions,
        COALESCE(SUM((mp.defense->>'sacks')::int),         0) AS sacks
      `;
      havingClause = `HAVING
          COALESCE(SUM((mp.defense->>'tackles')::int), 0) > 0
          OR COALESCE(SUM((mp.defense->>'interceptions')::int), 0) > 0
          OR COALESCE(SUM((mp.defense->>'sacks')::int), 0) > 0`;
      orderCol = `COALESCE(SUM((mp.defense->>'tackles')::int), 0) DESC`;
    }

    const query = `
      SELECT
        p.user_id,
        p.display_name,
        p.headshot_url,
        (
          SELECT mp2.team_name
          FROM match_participants mp2
          JOIN matches m2 ON m2.match_id = mp2.match_id
          WHERE mp2.user_id = p.user_id
          ORDER BY m2.exported_at DESC
          LIMIT 1
        ) AS team_name,
        ${selectCols}
      FROM match_participants mp
      JOIN players p ON p.user_id = mp.user_id
      JOIN matches m ON m.match_id = mp.match_id
      WHERE mp.${category} IS NOT NULL
      ${seasonFilter}
      GROUP BY p.user_id, p.display_name, p.headshot_url
      ${havingClause}
      ORDER BY ${orderCol}
    `;

    const result = await pool.query(query, queryParams);
    return res.json({ category, season: seasonParam || 'all', players: result.rows });
  } catch (err) {
    console.error('Stats query error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
