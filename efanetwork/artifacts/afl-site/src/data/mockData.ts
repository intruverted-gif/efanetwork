export const MATCHUPS = [
  { team1: 'Eagles', abbr1: 'PHI', team2: 'Cowboys', abbr2: 'DAL', score1: 38, score2: 24, played: true },
  { team1: 'Chiefs', abbr1: 'KC', team2: 'Ravens', abbr2: 'BAL', score1: 28, score2: 31, played: true },
  { team1: 'Chargers', abbr1: 'LAC', team2: 'Dolphins', abbr2: 'MIA', score1: 21, score2: 17, played: true },
  { team1: 'Packers', abbr1: 'GB', team2: 'Vikings', abbr2: 'MIN', score1: null, score2: null, played: false },
  { team1: 'Bengals', abbr1: 'CIN', team2: 'Steelers', abbr2: 'PIT', score1: null, score2: null, played: false },
];

export const STAT_LEADERS: Record<string, { name: string; team: string; val: string }[]> = {
  'Passing Yards': [
    { name: 'T. Mahomes', team: 'KC', val: '4,283' },
    { name: 'J. Herbert', team: 'LAC', val: '3,991' },
    { name: 'J. Burrow', team: 'CIN', val: '3,875' },
    { name: 'L. Jackson', team: 'BAL', val: '3,654' },
    { name: 'J. Love', team: 'GB', val: '3,542' },
  ],
  'Passing TDs': [
    { name: 'T. Mahomes', team: 'KC', val: '37' },
    { name: 'J. Burrow', team: 'CIN', val: '31' },
    { name: 'L. Jackson', team: 'BAL', val: '28' },
    { name: 'J. Herbert', team: 'LAC', val: '26' },
    { name: 'J. Love', team: 'GB', val: '24' },
  ],
  'Rushing Yards': [
    { name: 'D. Henry', team: 'BAL', val: '1,541' },
    { name: 'J. Jefferson', team: 'KC', val: '1,203' },
    { name: 'D. Montgomery', team: 'DET', val: '1,087' },
    { name: 'B. Robinson', team: 'WAS', val: '987' },
    { name: 'C. McCaffrey', team: 'SF', val: '934' },
  ],
  'Rushing TDs': [
    { name: 'D. Henry', team: 'BAL', val: '14' },
    { name: 'D. Montgomery', team: 'DET', val: '11' },
    { name: 'J. Jefferson', team: 'KC', val: '10' },
    { name: 'B. Robinson', team: 'WAS', val: '9' },
    { name: 'C. McCaffrey', team: 'SF', val: '8' },
  ],
  'Receiving Yards': [
    { name: 'T. Hill', team: 'MIA', val: '1,621' },
    { name: 'J. Jefferson', team: 'MIN', val: '1,488' },
    { name: 'A. Cooper', team: 'BUF', val: '1,312' },
    { name: 'S. Diggs', team: 'NE', val: '1,287' },
    { name: 'D. Adams', team: 'LV', val: '1,201' },
  ],
  'Receiving TDs': [
    { name: 'T. Hill', team: 'MIA', val: '12' },
    { name: 'D. Adams', team: 'LV', val: '11' },
    { name: 'J. Jefferson', team: 'MIN', val: '10' },
    { name: 'A. Cooper', team: 'BUF', val: '9' },
    { name: 'S. Diggs', team: 'NE', val: '9' },
  ],
};

export const STANDINGS: Record<string, Record<string, { name: string; abbr: string; wins: number; losses: number }[]>> = {
  AFC: {
    'AFC East': [
      { name: 'Bills', abbr: 'BUF', wins: 11, losses: 3 },
      { name: 'Dolphins', abbr: 'MIA', wins: 8, losses: 6 },
      { name: 'Patriots', abbr: 'NE', wins: 4, losses: 10 },
      { name: 'Jets', abbr: 'NYJ', wins: 3, losses: 11 },
    ],
    'AFC North': [
      { name: 'Ravens', abbr: 'BAL', wins: 12, losses: 2 },
      { name: 'Bengals', abbr: 'CIN', wins: 9, losses: 5 },
      { name: 'Steelers', abbr: 'PIT', wins: 8, losses: 6 },
      { name: 'Browns', abbr: 'CLE', wins: 3, losses: 11 },
    ],
    'AFC South': [
      { name: 'Texans', abbr: 'HOU', wins: 10, losses: 4 },
      { name: 'Colts', abbr: 'IND', wins: 7, losses: 7 },
      { name: 'Jaguars', abbr: 'JAX', wins: 4, losses: 10 },
      { name: 'Titans', abbr: 'TEN', wins: 2, losses: 12 },
    ],
    'AFC West': [
      { name: 'Chiefs', abbr: 'KC', wins: 13, losses: 1 },
      { name: 'Raiders', abbr: 'LV', wins: 7, losses: 7 },
      { name: 'Chargers', abbr: 'LAC', wins: 6, losses: 8 },
      { name: 'Broncos', abbr: 'DEN', wins: 5, losses: 9 },
    ],
  },
  NFC: {
    'NFC East': [
      { name: 'Eagles', abbr: 'PHI', wins: 12, losses: 2 },
      { name: 'Cowboys', abbr: 'DAL', wins: 9, losses: 5 },
      { name: 'Giants', abbr: 'NYG', wins: 4, losses: 10 },
      { name: 'Commanders', abbr: 'WAS', wins: 8, losses: 6 },
    ],
    'NFC North': [
      { name: 'Lions', abbr: 'DET', wins: 11, losses: 3 },
      { name: 'Packers', abbr: 'GB', wins: 9, losses: 5 },
      { name: 'Vikings', abbr: 'MIN', wins: 7, losses: 7 },
      { name: 'Bears', abbr: 'CHI', wins: 4, losses: 10 },
    ],
    'NFC South': [
      { name: 'Buccaneers', abbr: 'TB', wins: 9, losses: 5 },
      { name: 'Saints', abbr: 'NO', wins: 6, losses: 8 },
      { name: 'Falcons', abbr: 'ATL', wins: 6, losses: 8 },
      { name: 'Panthers', abbr: 'CAR', wins: 2, losses: 12 },
    ],
    'NFC West': [
      { name: '49ers', abbr: 'SF', wins: 11, losses: 3 },
      { name: 'Seahawks', abbr: 'SEA', wins: 8, losses: 6 },
      { name: 'Rams', abbr: 'LAR', wins: 7, losses: 7 },
      { name: 'Cardinals', abbr: 'ARZ', wins: 3, losses: 11 },
    ],
  },
};

export const AWARD_CATEGORIES = [
  'MVP', 'Offensive Player of the Year', 'Defensive Player of the Year',
  'Passing Leader', 'Rushing Leader', 'Receiving Leader',
];

export const AWARD_LEADERS: Record<string, { name: string; team: string; val: string; pos: string }[]> = {
  'MVP': [
    { name: 'T. Mahomes', team: 'KC', val: '38.2', pos: 'QB' },
    { name: 'L. Jackson', team: 'BAL', val: '36.8', pos: 'QB' },
    { name: 'J. Burrow', team: 'CIN', val: '34.1', pos: 'QB' },
    { name: 'T. Hill', team: 'MIA', val: '31.5', pos: 'WR' },
    { name: 'D. Henry', team: 'BAL', val: '29.7', pos: 'RB' },
  ],
  'Offensive Player of the Year': [
    { name: 'T. Hill', team: 'MIA', val: '94.2', pos: 'WR' },
    { name: 'J. Jefferson', team: 'MIN', val: '91.3', pos: 'WR' },
    { name: 'D. Henry', team: 'BAL', val: '88.7', pos: 'RB' },
    { name: 'T. Mahomes', team: 'KC', val: '87.1', pos: 'QB' },
    { name: 'A. Cooper', team: 'BUF', val: '84.5', pos: 'WR' },
  ],
  'Passing Leader': [
    { name: 'T. Mahomes', team: 'KC', val: '4,283', pos: 'QB' },
    { name: 'J. Herbert', team: 'LAC', val: '3,991', pos: 'QB' },
    { name: 'J. Burrow', team: 'CIN', val: '3,875', pos: 'QB' },
    { name: 'L. Jackson', team: 'BAL', val: '3,654', pos: 'QB' },
    { name: 'J. Love', team: 'GB', val: '3,542', pos: 'QB' },
  ],
  'Rushing Leader': [
    { name: 'D. Henry', team: 'BAL', val: '1,541', pos: 'RB' },
    { name: 'J. Jefferson', team: 'KC', val: '1,203', pos: 'RB' },
    { name: 'D. Montgomery', team: 'DET', val: '1,087', pos: 'RB' },
    { name: 'B. Robinson', team: 'WAS', val: '987', pos: 'RB' },
    { name: 'C. McCaffrey', team: 'SF', val: '934', pos: 'RB' },
  ],
  'Receiving Leader': [
    { name: 'T. Hill', team: 'MIA', val: '1,621', pos: 'WR' },
    { name: 'J. Jefferson', team: 'MIN', val: '1,488', pos: 'WR' },
    { name: 'A. Cooper', team: 'BUF', val: '1,312', pos: 'WR' },
    { name: 'S. Diggs', team: 'NE', val: '1,287', pos: 'WR' },
    { name: 'D. Adams', team: 'LV', val: '1,201', pos: 'WR' },
  ],
  'Defensive Player of the Year': [
    { name: 'M. Chase', team: 'CIN', val: '97.1', pos: 'CB' },
    { name: 'T. Smith', team: 'BAL', val: '94.3', pos: 'LB' },
    { name: 'M. Jones', team: 'DET', val: '91.8', pos: 'DE' },
    { name: 'B. Graham', team: 'PHI', val: '88.2', pos: 'DT' },
    { name: 'K. Leonard', team: 'IND', val: '85.7', pos: 'CB' },
  ],
};

export const VIDEOS = [
  {
    id: 'ncfRRb9J0wleE6BER',
    title: 'HAIL MARY TO WIN THE GAME!',
    url: 'https://medal.tv/games/roblox/clip/ncfRRb9J0wleE6BER',
    thumbnail: '/hail-mary-thumb.jpg',
    platform: 'medal',
  },
];

export type Conference = 'AFC' | 'NFC';
