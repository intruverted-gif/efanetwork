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

    const result = await pool.query(
      `
        SELECT
          user_id,
          display_name,
          headshot_url,
          team_name,
          category,
          season,
          completions,
          attempts,
          yards,
          tds,
          ints,
          carries,
          receptions,
          tackles,
          interceptions,
          sacks
        FROM player_stats
        WHERE category = $1
      `,
      [category]
    );

    const rows = (result.rows ?? []).filter((row: any) => {
      if (!seasonNum) return true;
      const seasonValue = row?.season;
      const normalized = String(seasonValue ?? '').trim().toLowerCase();
      return normalized === String(seasonNum) || normalized === `season ${seasonNum}`;
    });

    return res.json({ category, season: seasonParam || 'all', players: rows });
  } catch (err) {
    console.error('Stats query error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
