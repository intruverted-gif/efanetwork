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
    
    const currentSeason = season ? String(season).trim() : 'SEASON 3';
    
    const statsRows = new Map();
    const playerDirectory = new Map();

    const createRow = (userId, displayName, teamName, headshotUrl, category, season) => ({
      user_id: userId,
      display_name: displayName,
      team_name: teamName,
      headshot_url: headshotUrl,
      category,
      season,
      completions: 0,
      attempts: 0,
      yards: 0,
      tds: 0,
      sacked: 0,
      interceptions: 0,
      carries: 0,
      receptions: 0,
      tackles: 0,
      sacks: 0,
    });

    const getOrCreateStatsRow = (userId, displayName, teamName, headshotUrl, category, season) => {
      const key = `${userId}:${category}:${season}`;
      const existing = statsRows.get(key);
      if (existing) {
        existing.display_name = displayName;
        existing.headshot_url = headshotUrl;
        existing.team_name = teamName;
        return existing;
      }

      const row = createRow(userId, displayName, teamName, headshotUrl, category, season);
      statsRows.set(key, row);
      return row;
    };

    const processTeam = (teamData) => {
      const teamName = teamData?.name || teamData?.teamName || teamData?.title || 'Unknown Team';
      const players = teamData?.players || [];

      for (const player of players) {
        const userId = Number(player.userId || player.robloxId || player.roblox_id || player.id) || 0;
        const displayName = player.name || player.username || player.displayName || 'Unknown';
        
        const headshotUrl = player.headshotUrl || 
          (userId > 0 ? `https://tr.rbxcdn.com/30DAY-AvatarHeadshot-${userId}-150x150-Png/150/150/AvatarHeadshot/Png` : '');

        if (userId > 0) {
          playerDirectory.set(userId, {
            id: userId,
            user_id: userId,
            roblox_id: userId,
            display_name: displayName,
            username: displayName,
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
          const row = getOrCreateStatsRow(userId, displayName, teamName, headshotUrl, 'passing', currentSeason);
          row.completions += passComp;
          row.attempts += passAtt;
          row.yards += passYds;
          row.tds += passTds;
          row.sacked += passSck;
          row.interceptions += passInts;
        }

        const rushCar = Number(rush.carries) || 0;
        const rushYds = Number(rush.yards) || 0;
        const rushTds = Number(rush.tds) || 0;

        if (rushCar > 0 || rushYds > 0 || rushTds > 0) {
          const row = getOrCreateStatsRow(userId, displayName, teamName, headshotUrl, 'rushing', currentSeason);
          row.carries += rushCar;
          row.yards += rushYds;
          row.tds += rushTds;
        }

        const recRec = Number(rec.receptions) || 0;
        const recYds = Number(rec.yards) || 0;
        const recTds = Number(rec.tds) || 0;

        if (recRec > 0 || recYds > 0 || recTds > 0) {
          const row = getOrCreateStatsRow(userId, displayName, teamName, headshotUrl, 'receiving', currentSeason);
          row.receptions += recRec;
          row.yards += recYds;
          row.tds += recTds;
        }

        const defTkl = Number(def.tackles) || 0;
        const defSck = Number(def.sacks) || 0;
        const defInt = Number(def.interceptions) || 0;

        if (defTkl > 0 || defSck > 0 || defInt > 0) {
          const row = getOrCreateStatsRow(userId, displayName, teamName, headshotUrl, 'defense', currentSeason);
          row.tackles += defTkl;
          row.sacks += defSck;
          row.interceptions += defInt;
        }
      }
    };

    processTeam(homeTeam);
    processTeam(awayTeam);

    if (playerDirectory.size > 0) {
      const playersList = Array.from(playerDirectory.values());
      await supabase.from('players').upsert(playersList, { onConflict: 'user_id' }).then(() => {}).catch(() => {});
    }

    const mergedRows = Array.from(statsRows.values());
    if (mergedRows.length > 0) {
      for (const row of mergedRows) {
        const { data: existingRows, error: selectError } = await supabase
          .from('player_stats')
          .select('*')
          .eq('user_id', row.user_id)
          .eq('category', row.category)
          .eq('season', row.season);

        if (selectError) throw selectError;

        let mergedRow = { ...row };
        if (existingRows && existingRows.length > 0) {
          mergedRow = existingRows.reduce((acc, existing) => ({
            ...acc,
            display_name: row.display_name || acc.display_name || existing.display_name,
            headshot_url: row.headshot_url || acc.headshot_url || existing.headshot_url,
            team_name: row.team_name || acc.team_name || existing.team_name,
            completions: (Number(acc.completions) || 0) + (Number(existing.completions) || 0),
            attempts: (Number(acc.attempts) || 0) + (Number(existing.attempts) || 0),
            yards: (Number(acc.yards) || 0) + (Number(existing.yards) || 0),
            tds: (Number(acc.tds) || 0) + (Number(existing.tds) || 0),
            sacked: (Number(acc.sacked) || 0) + (Number(existing.sacked) || 0),
            interceptions: (Number(acc.interceptions) || 0) + (Number(existing.interceptions) || 0),
            carries: (Number(acc.carries) || 0) + (Number(existing.carries) || 0),
            receptions: (Number(acc.receptions) || 0) + (Number(existing.receptions) || 0),
            tackles: (Number(acc.tackles) || 0) + (Number(existing.tackles) || 0),
            sacks: (Number(acc.sacks) || 0) + (Number(existing.sacks) || 0),
          }), { ...row });
        }

        const { error: deleteError } = await supabase
          .from('player_stats')
          .delete()
          .eq('user_id', row.user_id)
          .eq('category', row.category)
          .eq('season', row.season);

        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase.from('player_stats').insert(mergedRow);
        if (insertError) throw insertError;
      }
    }

    return res.status(200).json({ success: true, count: mergedRows.length });
  } catch (err) {
    console.error('Import error:', err);
    return res.status(500).json({ error: err.message });
  }
}