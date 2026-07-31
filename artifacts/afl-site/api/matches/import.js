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
    const currentSeason = season || 'SEASON 3';
    const rows = [];

    const processTeam = (teamData) => {
      const teamName = teamData.name || '';
      const players = teamData.players || [];

      for (const player of players) {
        const userId = Number(player.robloxId) || 0;
        const displayName = player.name || 'Unknown';
        const headshotUrl = userId 
          ? `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`
          : '';

        // 1. PASSING CATEGORY
        if (player.passing && (player.passing.attempts > 0 || player.passing.completions > 0 || player.passing.yards !== 0)) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'passing',
            season: currentSeason,
            completions: player.passing.completions || 0,
            attempts: player.passing.attempts || 0,
            yards: player.passing.yards || 0,
            tds: player.passing.tds || 0,
            sacked: player.passing.sacked || 0,
            interceptions: player.passing.ints || 0,
            carries: 0,
            receptions: 0,
            tackles: 0,
            sacks: 0
          });
        }

        // 2. RUSHING CATEGORY
        if (player.rushing && (player.rushing.carries > 0 || player.rushing.yards !== 0)) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'rushing',
            season: currentSeason,
            carries: player.rushing.carries || 0,
            yards: player.rushing.yards || 0,
            tds: player.rushing.tds || 0,
            completions: 0,
            attempts: 0,
            sacked: 0,
            receptions: 0,
            interceptions: 0,
            tackles: 0,
            sacks: 0
          });
        }

        // 3. RECEIVING CATEGORY
        if (player.receiving && (player.receiving.receptions > 0 || player.receiving.yards !== 0)) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'receiving',
            season: currentSeason,
            receptions: player.receiving.receptions || 0,
            yards: player.receiving.yards || 0,
            tds: player.receiving.tds || 0,
            completions: 0,
            attempts: 0,
            sacked: 0,
            carries: 0,
            interceptions: 0,
            tackles: 0,
            sacks: 0
          });
        }

        // 4. DEFENSE CATEGORY
        if (player.defense && (player.defense.tackles > 0 || player.defense.sacks > 0 || player.defense.interceptions > 0)) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'defense',
            season: currentSeason,
            tackles: player.defense.tackles || 0,
            sacks: player.defense.sacks || 0,
            interceptions: player.defense.interceptions || 0,
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

    if (rows.length > 0) {
      const { data, error } = await supabase
        .from('player_stats')
        .upsert(rows);

      if (error) throw error;
    }

    return res.status(200).json({ success: true, count: rows.length });
  } catch (err) {
    console.error('Import error:', err);
    return res.status(500).json({ error: err.message });
  }
}