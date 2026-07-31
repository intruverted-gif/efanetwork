import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || token !== process.env.WEBSITE_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { matchId, homeTeam, awayTeam } = req.body;

    const rows = [];
    const allPlayers = [
      ...(homeTeam.players || []),
      ...(awayTeam.players || [])
    ];

    for (const player of allPlayers) {
      rows.push({
        match_id: matchId,
        player_name: player.name,
        roblox_id: player.robloxId || null,
        
        pass_completions: player.passing?.completions || 0,
        pass_attempts: player.passing?.attempts || 0,
        pass_yards: player.passing?.yards || 0,
        pass_tds: player.passing?.tds || 0,
        pass_ints: player.passing?.ints || 0,
        sacked: player.passing?.sacked || 0,

        rush_carries: player.rushing?.carries || 0,
        rush_yards: player.rushing?.yards || 0,
        rush_tds: player.rushing?.tds || 0,

        rec_receptions: player.receiving?.receptions || 0,
        rec_yards: player.receiving?.yards || 0,
        rec_tds: player.receiving?.tds || 0,

        def_tackles: player.defense?.tackles || 0,
        def_sacks: player.defense?.sacks || 0,
        interceptions: player.defense?.interceptions || 0,
      });
    }

    const { data, error } = await supabase
      .from('player_stats')
      .upsert(rows);

    if (error) throw error;

    return res.status(200).json({ success: true, count: rows.length });
  } catch (err) {
    console.error('Import error:', err);
    return res.status(500).json({ error: err.message });
  }
}