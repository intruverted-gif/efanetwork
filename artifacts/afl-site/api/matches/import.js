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
    
    const rawSeason = season ? String(season).toLowerCase().trim() : 'season 3';
    const currentSeason = rawSeason.includes('3') ? 'season 3' : rawSeason;
    
    const rows = [];
    const playerDirectory = new Map();

    const processTeam = (teamData) => {
      const teamName = teamData?.name || teamData?.teamName || teamData?.title || 'Unknown Team';
      const players = teamData?.players || [];

      for (const player of players) {
        const userId = Number(player.robloxId) || 0;
        const displayName = player.name || 'Unknown';
        
        const headshotUrl = userId > 0 
          ? `https://tr.rbxcdn.com/30DAY-AvatarHeadshot-${userId}-150x150-Png/150/150/AvatarHeadshot/Png`
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

        const passComp = Number(pass.completions) || 0;
        const passAtt = Number(pass.attempts) || 0;
        const passYds = Number(pass.yards) || 0;
        const passTds = Number(pass.tds) || 0;
        const passInts = Number(pass.ints) || Number(pass.interceptions) || 0;
        const passSck = Number(pass.sacked) || 0;

        if (passComp > 0 || passAtt > 0 || passYds > 0 || passTds > 0 || passInts > 0) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'passing',
            season: currentSeason,
            completions: passComp,
            attempts: passAtt,
            yards: passYds,
            tds: passTds,
            sacked: passSck,
            interceptions: passInts,
            carries: 0,
            receptions: 0,
            tackles: 0,
            sacks: 0
          });
        }

        const rushCar = Number(rush.carries) || 0;
        const rushYds = Number(rush.yards) || 0;
        const rushTds = Number(rush.tds) || 0;

        if (rushCar > 0 || rushYds > 0 || rushTds > 0) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'rushing',
            season: currentSeason,
            carries: rushCar,
            yards: rushYds,
            tds: rushTds,
            completions: 0,
            attempts: 0,
            sacked: 0,
            receptions: 0,
            interceptions: 0,
            tackles: 0,
            sacks: 0
          });
        }

        const recRec = Number(rec.receptions) || 0;
        const recYds = Number(rec.yards) || 0;
        const recTds = Number(rec.tds) || 0;

        if (recRec > 0 || recYds > 0 || recTds > 0) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'receiving',
            season: currentSeason,
            receptions: recRec,
            yards: recYds,
            tds: recTds,
            completions: 0,
            attempts: 0,
            sacked: 0,
            carries: 0,
            interceptions: 0,
            tackles: 0,
            sacks: 0
          });
        }

        const defTkl = Number(def.tackles) || 0;
        const defSck = Number(def.sacks) || 0;
        const defInt = Number(def.interceptions) || 0;

        if (defTkl > 0 || defSck > 0 || defInt > 0) {
          rows.push({
            user_id: userId,
            display_name: displayName,
            team_name: teamName,
            headshot_url: headshotUrl,
            category: 'defense',
            season: currentSeason,
            tackles: defTkl,
            sacks: defSck,
            interceptions: defInt,
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