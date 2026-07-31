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
    const { matchId, homeTeam, awayTeam, season } = req.body;
    
    const currentSeason = season ? String(season).toLowerCase().trim() : 'season 3';
    const rows = [];
    const playerDirectory = new Map();

    const processTeam = (teamData) => {
      const teamName = teamData?.name || '';
      const players = teamData?.players || [];

      for (const player of players) {
        const userId = Number(player.robloxId) || 0;
        const displayName = player.name || 'Unknown';
        
        const headshotUrl = userId 
          ? `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`
          : '';

        if (userId > 0) {
          playerDirectory.set(userId, {
            user_id: userId,
            roblox_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl
          });
        }

        const pass = player.passing || {};
        const rush = player.rushing || {};
        const rec = player.receiving || {};
        const def = player.defense || {};

        if (Number(pass.attempts) > 0 || Number(pass.completions) > 0 || Number(pass.yards) !== 0) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'passing',
            season: currentSeason,
            completions: Number(pass.completions) || 0,
            attempts: Number(pass.attempts) || 0,
            yards: Number(pass.yards) || 0,
            tds: Number(pass.tds) || 0,
            sacked: Number(pass.sacked) || 0,
            interceptions: Number(pass.ints) || 0,
            carries: 0,
            receptions: 0,
            tackles: 0,
            sacks: 0
          });
        }

        if (Number(rush.carries) > 0 || Number(rush.yards) !== 0) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'rushing',
            season: currentSeason,
            carries: Number(rush.carries) || 0,
            yards: Number(rush.yards) || 0,
            tds: Number(rush.tds) || 0,
            completions: 0,
            attempts: 0,
            sacked: 0,
            receptions: 0,
            interceptions: 0,
            tackles: 0,
            sacks: 0
          });
        }

        if (Number(rec.receptions) > 0 || Number(rec.yards) !== 0) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'receiving',
            season: currentSeason,
            receptions: Number(rec.receptions) || 0,
            yards: Number(rec.yards) || 0,
            tds: Number(rec.tds) || 0,
            completions: 0,
            attempts: 0,
            sacked: 0,
            carries: 0,
            interceptions: 0,
            tackles: 0,
            sacks: 0
          });
        }

        if (Number(def.tackles) > 0 || Number(def.sacks) > 0 || Number(def.interceptions) > 0) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'defense',
            season: currentSeason,
            tackles: Number(def.tackles) || 0,
            sacks: Number(def.sacks) || 0,
            interceptions: Number(def.interceptions) || 0,
            completions: 0,
            attempts: 0,
            yards: 0,
            tds: 0,
            sacked: 0,
            carries: 0,
            receptions: 0
          });
        }
      }
    };

    processTeam(homeTeam);
    processTeam(awayTeam);

    if (playerDirectory.size > 0) {
      const playersList = Array.from(playerDirectory.values());
      await supabase.from('players').upsert(playersList, { onConflict: 'user_id' }).then(() => {}).catch(() => {});
    }

    if (rows.length > 0) {
      const { error } = await supabase.from('player_stats').upsert(rows);
      if (error) throw error;
    }

    return res.status(200).json({ success: true, count: rows.length });
  } catch (err) {
    console.error('Import error:', err);
    return res.status(500).json({ error: err.message });
  }
}