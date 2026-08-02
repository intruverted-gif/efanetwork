// ─────────────────────────────────────────────────────────────
//  EFA Season 3 Data — edit this file to update scores/schedule
// ─────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  city: string;
  nickname: string;
  logo: string;          // relative to /
  primaryColor: string;
  secondaryColor: string;
  record?: { w: number; l: number };
}

export interface Game {
  home: string;           // team id
  away: string;           // team id
  homeScore: number | null; // null = not played yet
  awayScore: number | null;
}

// ── Teams ──────────────────────────────────────────────────────
export const TEAMS: Record<string, Team> = {
  'carroll': {
    id: 'carroll',
    city: 'Southlake',
    nickname: 'Dragons',
    logo: '/team-logos/carroll.png',
    primaryColor: '#006633',
    secondaryColor: '#ffffff',
  },
  'corner-canyon': {
    id: 'corner-canyon',
    city: 'Corner Canyon',
    nickname: 'Chargers',
    logo: '/team-logos/corner-canyon.png',
    primaryColor: '#1a3a6b',
    secondaryColor: '#a0aec0',
  },
  'west-bacon': {
    id: 'west-bacon',
    city: 'West Boca',
    nickname: 'Bulls',
    logo: '/team-logos/west-bacon.png',
    primaryColor: '#1a3a6b',
    secondaryColor: '#c9a84c',
  },
  'huffman': {
    id: 'huffman',
    city: 'Huffman',
    nickname: 'Vikings',
    logo: '/team-logos/huffman.png',
    primaryColor: '#1a7a3a',
    secondaryColor: '#e8612a',
  },
  'bishop-gorman': {
    id: 'bishop-gorman',
    city: 'Bishop Gorman',
    nickname: 'Gaels',
    logo: '/team-logos/bishop-gorman.png',
    primaryColor: '#1a3fa0',
    secondaryColor: '#e8701a',
  },
  'cascade': {
    id: 'cascade',
    city: 'Cascade',
    nickname: 'Bruins',
    logo: '/team-logos/cascade.png',
    primaryColor: '#c20211',
    secondaryColor: '#1a1a1a',
  },
  'deverx': {
    id: 'deverx',
    city: 'DeverX',
    nickname: 'Indians',
    logo: '/team-logos/deverx.png',
    primaryColor: '#4a2080',
    secondaryColor: '#c0a030',
  },
  'san-marco': {
    id: 'san-marco',
    city: 'San Marco',
    nickname: 'Mustangs',
    logo: '/team-logos/san-marco.png',
    primaryColor: '#c20211',
    secondaryColor: '#1a1a1a',
  },
};

// ── Schedule ───────────────────────────────────────────────────
// To enter scores: set homeScore and awayScore to numbers.
// To mark a game as not yet played: keep both as null.
//
// Home team is always listed first (home / away).

export const SCHEDULE: Record<string, Game[]> = {
  week1: [
    { home: 'carroll',       away: 'san-marco',     homeScore: 8,    awayScore: 22   },
    { home: 'deverx',        away: 'corner-canyon', homeScore: 27,   awayScore: 32   },
    { home: 'west-bacon',    away: 'cascade',       homeScore: 28,   awayScore: 6    },
    { home: 'huffman',       away: 'bishop-gorman', homeScore: 19,   awayScore: 22   },
  ],
  week2: [
    { home: 'corner-canyon', away: 'carroll',       homeScore: 14, awayScore: 6 },
    { home: 'san-marco',     away: 'west-bacon',    homeScore: 20, awayScore: 26 },
    { home: 'deverx',        away: 'huffman',       homeScore: 28, awayScore: 24 },
    { home: 'bishop-gorman', away: 'cascade',       homeScore: 21, awayScore: 0 },
  ],
  week3: [
    { home: 'carroll',       away: 'west-bacon',    homeScore: null, awayScore: null },
    { home: 'huffman',       away: 'corner-canyon', homeScore: null, awayScore: null },
    { home: 'san-marco',     away: 'bishop-gorman', homeScore: null, awayScore: null },
    { home: 'cascade',       away: 'deverx',        homeScore: 20, awayScore: 26 },
  ],
  week4: [
    { home: 'huffman',       away: 'carroll',       homeScore: null, awayScore: null },
    { home: 'west-bacon',    away: 'bishop-gorman', homeScore: null, awayScore: null },
    { home: 'corner-canyon', away: 'cascade',       homeScore: null, awayScore: null },
    { home: 'deverx',        away: 'san-marco',     homeScore: null, awayScore: null },
  ],
  week5: [
    { home: 'bishop-gorman', away: 'carroll',       homeScore: null, awayScore: null },
    { home: 'cascade',       away: 'huffman',       homeScore: null, awayScore: null },
    { home: 'west-bacon',    away: 'deverx',        homeScore: null, awayScore: null },
    { home: 'san-marco',     away: 'corner-canyon', homeScore: null, awayScore: null },
  ],
  week6: [
    { home: 'carroll',       away: 'cascade',       homeScore: null, awayScore: null },
    { home: 'bishop-gorman', away: 'deverx',        homeScore: null, awayScore: null },
    { home: 'huffman',       away: 'san-marco',     homeScore: null, awayScore: null },
    { home: 'corner-canyon', away: 'west-bacon',    homeScore: null, awayScore: null },
  ],
};
