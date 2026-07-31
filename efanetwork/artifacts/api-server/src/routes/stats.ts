import { Router, type IRouter } from 'express';
import { pool } from '@workspace/db';

const router: IRouter = Router();

const VALID_CATEGORIES = ['passing', 'rushing', 'receiving', 'defense'] as const;
type Category = typeof VALID_CATEGORIES[number];

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

  const seasonFilter = seasonNum ? 'AND m.season = $1' : '';
  const queryParams: any[] = seasonNum ? [seasonNum] : [];

  // Build per-category aggregation. Use aliases in HAVING/ORDER so Postgres
  // sees aggregate expressions, not raw column references.
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
    // defense
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

  try {
    const result = await pool.query(query, queryParams);
    res.json({ category, season: seasonParam || 'all', players: result.rows });
  } catch (err) {
    console.error('Stats query error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
