// Shared legacy data — awards and championship rosters.
// Used by Legacy pages AND PlayerProfile.

export interface LegacyAward {
  season: number;
  label: string;
  trophy: string;
  color: string;
}

export interface RosterPlayer {
  name: string;
  headshot?: string; // optional — known headshots only
}

export interface ChampionshipRoster {
  season: number;
  teamName: string;
  teamLogo: string;
  players: RosterPlayer[];
}

// ── Individual awards ────────────────────────────────────────────────────────

const RAW_AWARDS: Array<{ player: string; season: number; label: string; trophy: string; color: string }> = [
  // Season 1
  { player: 'k4masi',          season: 1, label: 'Season MVP',      trophy: '👑', color: '#FFD700' },
  { player: 'k4masi',          season: 1, label: 'QB of the Year',  trophy: '🏆', color: '#FFA500' },
  { player: 'worldvszai',      season: 1, label: 'RB of the Year',  trophy: '🥇', color: '#C0A060' },
  { player: 'mr_devy1122',     season: 1, label: 'WR of the Year',  trophy: '⚡', color: '#A8D8FF' },
  { player: 'coltons12_20',    season: 1, label: 'TE of the Year',  trophy: '🔥', color: '#FF8C42' },
  { player: 'koolaid_man603',  season: 1, label: 'OL of the Year',  trophy: '🛡️', color: '#98FF98' },
  // Season 2
  { player: 'rolboxboy272248', season: 2, label: 'Season MVP',      trophy: '👑', color: '#FFD700' },
  { player: 'rolboxboy272248', season: 2, label: 'QB of the Year',  trophy: '🏆', color: '#FFA500' },
  { player: 'worldvszai',      season: 2, label: 'RB of the Year',  trophy: '🥇', color: '#C0A060' },
  { player: 'sheluvqub',       season: 2, label: 'WR of the Year',  trophy: '⚡', color: '#A8D8FF' },
  { player: '1conceptionz',    season: 2, label: 'TE of the Year',  trophy: '🔥', color: '#FF8C42' },
  { player: 'koolaid_man603',  season: 2, label: 'OL of the Year',  trophy: '🛡️', color: '#98FF98' },
];

/** Returns legacy awards for a given display_name (case-insensitive). */
export function getAwardsForPlayer(displayName: string): LegacyAward[] {
  const key = displayName.toLowerCase().trim();
  return RAW_AWARDS
    .filter((r) => r.player.toLowerCase() === key)
    .map(({ season, label, trophy, color }) => ({ season, label, trophy, color }));
}

// ── Championship rosters ─────────────────────────────────────────────────────

export const CHAMPIONSHIP_ROSTERS: ChampionshipRoster[] = [
  {
    season: 1,
    teamName: 'Don Bosco',
    teamLogo: '/db-logo.png',
    players: [
      { name: 'k4masi',         headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-07580A7F9319D0393751027D8CCE97CD-Png/150/150/AvatarHeadshot/Png/noFilter' },
      { name: 'silentfloat',    headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C4E397C7F249A831F70F925E8EFB1860-Png/150/150/AvatarHeadshot/Png/noFilter' },
      { name: 'talkdoesitall', headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-2E62F8731217C746A63DAA4819FDAD8E-Png/150/150/AvatarHeadshot/Png/noFilter' },
      { name: '2kdrx',         headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-B5B5241418BF0B55C9403DCDAB8FA073-Png/150/150/AvatarHeadshot/Png/noFilter' },
      { name: 'WorldvsZai',     headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C3898109DA64FC26780801E1E8AA9A42-Png/150/150/AvatarHeadshot/Png/noFilter' },
      { name: 'mr_devy1122',    headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-0C2F38FF9A7DF87D366F958990B43940-Png/150/150/AvatarHeadshot/Png/noFilter' },
      { name: 'Koolaid_Man603', headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-3C4439AFA1B687C9F434023C787B6E67-Png/150/150/AvatarHeadshot/Png/noFilter' },
    ],
  },
  {
    season: 2,
    teamName: 'Duncanville',
    teamLogo: '/dville-logo.png',
    players: [
      { name: 'rolboxboy272248', headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C38E62048A2D78CB09BF8B3F1BA4C7F9-Png/150/150/AvatarHeadshot/Png/noFilter' },
      { name: 'WorldvsZai',      headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C3898109DA64FC26780801E1E8AA9A42-Png/150/150/AvatarHeadshot/Png/noFilter' },
      { name: '1conceptionz',    headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-6E2E8B2716C721483AEB6524F487E2A4-Png/150/150/AvatarHeadshot/Png/noFilter' },
    ],
  },
];

/**
 * Returns the season numbers where this player won a championship ring.
 * Match is case-insensitive.
 */
export function getRingsForPlayer(displayName: string): number[] {
  const key = displayName.toLowerCase().trim();
  return CHAMPIONSHIP_ROSTERS
    .filter((r) => r.players.some((p) => p.name.toLowerCase() === key))
    .map((r) => r.season);
}
