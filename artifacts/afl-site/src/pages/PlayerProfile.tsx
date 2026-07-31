import React, { useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { TEAMS } from '../data/schedule';
import { getAwardsForPlayer, getRingsForPlayer } from '../data/legacyAwards';
import { supabase } from '../lib/supabase';

// ── Types ────────────────────────────────────────────────────────────────────

interface GameEntry {
  matchId: string;
  season: number;
  exportedAt: string;
  myTeamName: string | null;
  myScore: number | null;
  opponentName: string | null;
  opponentScore: number | null;
  won: boolean | null;
  passing: { completions: number; attempts: number; yards: number; tds: number; ints: number } | null;
  rushing: { carries: number; yards: number; tds: number } | null;
  receiving: { receptions: number; yards: number; tds: number } | null;
  defense: { tackles: number; interceptions: number; sacks: number } | null;
}

interface CareerTotals {
  gamesPlayed: number;
  passing: { completions: number; attempts: number; yards: number; tds: number; ints: number };
  rushing: { carries: number; yards: number; tds: number };
  receiving: { receptions: number; yards: number; tds: number };
  defense: { tackles: number; interceptions: number; sacks: number };
}

interface PlayerProfile {
  userId: number;
  displayName: string;
  headshotUrl: string | null;
  teamName: string | null;
  careerTotals: CareerTotals;
  games: GameEntry[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23374151'/%3E%3Ctext x='40' y='52' text-anchor='middle' fill='%23d1d5db' font-size='36' font-family='sans-serif'%3E%3F%3C/text%3E%3C/svg%3E";

function fuzzyTeam(name: string | null) {
  if (!name) return null;
  const lower = name.toLowerCase();
  for (const t of Object.values(TEAMS)) {
    if (lower.includes(t.city.toLowerCase()) || lower.includes(t.nickname.toLowerCase())) return t;
  }
  return null;
}

/** Derive the player's primary position from career totals. */
function derivePosition(ct: CareerTotals): string {
  const scores = [
    { pos: 'QB', score: ct.passing.yards + ct.passing.tds * 10 },
    { pos: 'RB', score: ct.rushing.yards + ct.rushing.tds * 10 },
    { pos: 'WR', score: ct.receiving.yards + ct.receiving.tds * 10 },
    { pos: 'DEF', score: ct.defense.tackles * 5 + ct.defense.interceptions * 15 + ct.defense.sacks * 10 },
  ];
  const best = scores.reduce((a, b) => (b.score > a.score ? b : a));
  return best.score > 0 ? best.pos : '—';
}

/** Format a matchId/date into a compact label. */
function gameLabel(matchId: string, exportedAt: string): string {
  // Try to extract week from matchId like "s3w2g1" or "week2_..."
  const wkMatch = matchId.match(/w(?:ee?k?)?[\-_]?(\d+)/i);
  if (wkMatch) return `WK ${wkMatch[1]}`;
  // Fallback: short date
  const d = new Date(exportedAt);
  return isNaN(d.getTime()) ? matchId.slice(0, 8) : `${d.getMonth() + 1}/${d.getDate()}`;
}

// ── Stat row renderers ────────────────────────────────────────────────────────

function PassingRow({ p }: { p: NonNullable<GameEntry['passing']> }) {
  if (!p || (p.yards === 0 && p.tds === 0 && p.completions === 0)) return null;
  return (
    <div className="pp-stat-row">
      <span className="pp-stat-pos">QB</span>
      <span className="pp-stat-item"><b>{p.completions}</b> CMP</span>
      <span className="pp-stat-item"><b>{p.attempts}</b> ATT</span>
      <span className="pp-stat-item"><b>{p.yards}</b> YDS</span>
      <span className="pp-stat-item"><b>{p.tds}</b> TD</span>
      {p.ints > 0 && <span className="pp-stat-item pp-stat-item--bad"><b>{p.ints}</b> INT</span>}
    </div>
  );
}

function RushingRow({ r }: { r: NonNullable<GameEntry['rushing']> }) {
  if (!r || (r.yards === 0 && r.tds === 0 && r.carries === 0)) return null;
  const avg = r.carries > 0 ? (r.yards / r.carries).toFixed(1) : '0.0';
  return (
    <div className="pp-stat-row">
      <span className="pp-stat-pos">RB</span>
      <span className="pp-stat-item"><b>{r.carries}</b> ATT</span>
      <span className="pp-stat-item"><b>{r.yards}</b> YDS</span>
      <span className="pp-stat-item"><b>{avg}</b> AVG</span>
      <span className="pp-stat-item"><b>{r.tds}</b> TD</span>
    </div>
  );
}

function ReceivingRow({ r }: { r: NonNullable<GameEntry['receiving']> }) {
  if (!r || (r.yards === 0 && r.tds === 0 && r.receptions === 0)) return null;
  return (
    <div className="pp-stat-row">
      <span className="pp-stat-pos">WR</span>
      <span className="pp-stat-item"><b>{r.receptions}</b> REC</span>
      <span className="pp-stat-item"><b>{r.yards}</b> YDS</span>
      <span className="pp-stat-item"><b>{r.tds}</b> TD</span>
    </div>
  );
}

function DefenseRow({ d }: { d: NonNullable<GameEntry['defense']> }) {
  if (!d || (d.tackles === 0 && d.interceptions === 0 && d.sacks === 0)) return null;
  return (
    <div className="pp-stat-row">
      <span className="pp-stat-pos">DEF</span>
      <span className="pp-stat-item"><b>{d.tackles}</b> TKL</span>
      {d.interceptions > 0 && <span className="pp-stat-item"><b>{d.interceptions}</b> INT</span>}
      {d.sacks > 0 && <span className="pp-stat-item"><b>{d.sacks}</b> SCK</span>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PlayerProfile() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const id = userId ?? '';

  console.log('[PlayerProfile] RENDER TRIGGERED with params:', id);

  const { data, isLoading, isError } = useQuery<PlayerProfile | null>({
    queryKey: ['player', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .or(`user_id.eq.${id},user_id.eq.${Number(id)}`);

      console.log('[PlayerProfile] DIRECT SUPABASE DATA:', data, error);
      console.log('[PlayerProfile] FULL RAW DB ROWS:', JSON.stringify(data, null, 2));

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return null;
      }

      const first = data[0] as Record<string, any>;
      console.log('[PlayerProfile] Raw DB Row Keys:', Object.keys(first ?? {}));
      console.log('[PlayerProfile] AVAILABLE PLAYER_STATS KEYS:', Object.keys(first ?? {}));

      const sumNumeric = (row: Record<string, any>, keys: string[]) => {
        for (const key of keys) {
          const rawValue = row[key];
          if (rawValue === null || rawValue === undefined || rawValue === '') {
            continue;
          }

          const numericValue = Number(rawValue);
          if (!Number.isNaN(numericValue)) {
            return numericValue;
          }
        }

        return 0;
      };

      const sumFromRows = (rows: Record<string, any>[], keys: string[]) => {
        return rows.reduce((sum: number, row: Record<string, any>) => sum + sumNumeric(row, keys), 0);
      };

      let totalRushYards = 0;
      let totalRushCarries = 0;

      data.forEach((row: Record<string, any>) => {
        const rushYdsKey = Object.keys(row).find((k) =>
          ['rush_yds', 'rush_yards', 'rushing_yards', 'rushing_yds'].includes(k.toLowerCase())
        );
        const carryKey = Object.keys(row).find((k) =>
          ['carries', 'rush_carries', 'car', 'att', 'attempts'].includes(k.toLowerCase()) && !k.includes('pass')
        );

        if (rushYdsKey && row[rushYdsKey] !== undefined) {
          totalRushYards += Number(row[rushYdsKey]) || 0;
        }

        if (carryKey && row[carryKey] !== undefined) {
          totalRushCarries += Number(row[carryKey]) || 0;
        }
      });

      const rushAvg = totalRushCarries > 0 ? (totalRushYards / totalRushCarries).toFixed(1) : '0.0';

      const aggregated: CareerTotals = {
        gamesPlayed: data.length,
        passing: {
          completions: sumFromRows(data, ['completions', 'comp', 'passing_completions', 'pass_completions', 'cmp']),
          attempts: sumFromRows(data, ['attempts', 'att', 'passing_attempts', 'pass_attempts', 'pass_att']),
          yards: data.reduce((sum: number, row: Record<string, any>) => {
            const passYards = row.pass_yds ?? row.passing_yards ?? row.pass_yards ?? row.yards ?? 0;
            const numericValue = Number(passYards);
            return sum + (Number.isNaN(numericValue) ? 0 : numericValue);
          }, 0),
          tds: data.reduce((sum: number, row: Record<string, any>) => {
            const passTds = row.pass_tds ?? row.passing_tds ?? row.pass_td ?? row.tds ?? 0;
            const numericValue = Number(passTds);
            return sum + (Number.isNaN(numericValue) ? 0 : numericValue);
          }, 0),
          ints: sumFromRows(data, ['ints', 'int', 'interceptions', 'passing_interceptions']),
        },
        rushing: {
          carries: data.reduce((sum: number, row: Record<string, any>) => {
            const rushCarries = Number(row.carries ?? row.rush_carries ?? row.car ?? 0);
            return sum + (Number.isNaN(rushCarries) ? 0 : rushCarries);
          }, 0),
          yards: data.reduce((sum: number, row: Record<string, any>) => {
            const rushYds = Number(
              row.rush_yds ??
              row.rush_yards ??
              row.rushing_yards ??
              row.rushing_yds ??
              row.rushYards ??
              0
            );
            return sum + (Number.isNaN(rushYds) ? 0 : rushYds);
          }, 0),
          tds: data.reduce((sum: number, row: Record<string, any>) => {
            const rushTds = Number(row.rush_tds ?? row.rush_td ?? row.rushing_tds ?? 0);
            return sum + (Number.isNaN(rushTds) ? 0 : rushTds);
          }, 0),
        },
        receiving: {
          receptions: sumFromRows(data, ['receptions', 'rec', 'receiving_receptions', 'rec_receptions']),
          yards: data.reduce((sum: number, row: Record<string, any>) => {
            const recYards = row.rec_yds ?? row.receiving_yards ?? row.rec_yards ?? 0;
            const numericValue = Number(recYards);
            return sum + (Number.isNaN(numericValue) ? 0 : numericValue);
          }, 0),
          tds: data.reduce((sum: number, row: Record<string, any>) => {
            const recTds = row.rec_tds ?? row.receiving_tds ?? row.rec_td ?? 0;
            const numericValue = Number(recTds);
            return sum + (Number.isNaN(numericValue) ? 0 : numericValue);
          }, 0),
        },
        defense: {
          tackles: sumFromRows(data, ['tackles', 'def_tackles', 'total_tackles']),
          interceptions: sumFromRows(data, ['interceptions', 'ints', 'def_interceptions']),
          sacks: sumFromRows(data, ['sacks', 'def_sacks']),
        },
      };

      return {
        userId: Number(id),
        displayName: first.display_name ?? 'Unknown Player',
        headshotUrl: first.headshot_url ?? null,
        teamName: first.team_name ?? null,
        careerTotals: aggregated,
        games: [],
      } as PlayerProfile;
    },
    enabled: !!id,
  });

  const team = useMemo(() => fuzzyTeam(data?.teamName ?? null), [data?.teamName]);
  const position = useMemo(() => (data ? derivePosition(data.careerTotals) : '—'), [data]);
  const legacyAwards = useMemo(() => (data ? getAwardsForPlayer(data.displayName) : []), [data]);
  const rings = useMemo(() => (data ? getRingsForPlayer(data.displayName) : []), [data]);

  if (isLoading) {
    return (
      <div className="pp-page">
        <div className="pp-loading">Loading player profile…</div>
      </div>
    );
  }

  if (isError || data === null) {
    return (
      <div className="pp-page">
        <div className="pp-error">
          <div className="pp-error-icon">⚠</div>
          <div className="pp-error-title">Player not found</div>
          <Link href="/stats" className="pp-back-link">← Back to Stats</Link>
        </div>
      </div>
    );
  }

  const { displayName, headshotUrl, careerTotals, games } = data;
  const ct = careerTotals;

  const hasPassingCareer = ct.passing.completions > 0 || ct.passing.attempts > 0 || ct.passing.yards > 0 || ct.passing.tds > 0 || ct.passing.ints > 0;
  const hasRushingCareer = ct.rushing.carries > 0 || ct.rushing.yards > 0 || ct.rushing.tds > 0;
  const hasReceivingCareer = ct.receiving.receptions > 0 || ct.receiving.yards > 0 || ct.receiving.tds > 0;
  const hasDefenseCareer = ct.defense.tackles > 0 || ct.defense.interceptions > 0 || ct.defense.sacks > 0;

  return (
    <div className="pp-page">

      {/* ── Hero header ─────────────────────────────────────────── */}
      <div className="pp-hero">
        <img
          className="pp-hero-avatar"
          src={headshotUrl || PLACEHOLDER}
          alt={displayName}
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
        <div className="pp-hero-info">
          <div className="pp-hero-name-row">
            <h1 className="pp-hero-name">{displayName}</h1>
            <span className="pp-hero-pos-badge">{position}</span>
          </div>
          {team && (
            <div className="pp-hero-team">
              <img className="pp-hero-team-logo" src={team.logo} alt={team.nickname} />
              <span className="pp-hero-team-name">{team.city} {team.nickname}</span>
            </div>
          )}
          {!team && data.teamName && (
            <div className="pp-hero-team">
              <span className="pp-hero-team-name">{data.teamName}</span>
            </div>
          )}
          {rings.length > 0 && (
            <div className="pp-rings">
              {rings.map((season) => (
                <span key={season} className="pp-ring" title={`Season ${season} Champion`}>
                  💍 <span className="pp-ring-label">S{season}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats top-right */}
        <div className="pp-hero-quick">
          <div className="pp-quick-stat">
            <span className="pp-quick-val">{ct.gamesPlayed}</span>
            <span className="pp-quick-lbl">GP</span>
          </div>
          {hasPassingCareer && (
            <div className="pp-quick-stat">
              <span className="pp-quick-val">{ct.passing.yards}</span>
              <span className="pp-quick-lbl">PASS YDS</span>
            </div>
          )}
          {hasRushingCareer && (
            <div className="pp-quick-stat">
              <span className="pp-quick-val">{ct.rushing.yards}</span>
              <span className="pp-quick-lbl">RUSH YDS</span>
            </div>
          )}
          {hasReceivingCareer && (
            <div className="pp-quick-stat">
              <span className="pp-quick-val">{ct.receiving.yards}</span>
              <span className="pp-quick-lbl">REC YDS</span>
            </div>
          )}
          {hasDefenseCareer && (
            <div className="pp-quick-stat">
              <span className="pp-quick-val">{ct.defense.tackles}</span>
              <span className="pp-quick-lbl">TACKLES</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Body: game log + sidebar ─────────────────────────────── */}
      <div className="pp-body">

        {/* Game log */}
        <div className="pp-main">
          <div className="pp-section-card">
            <div className="pp-section-head">
              <h2 className="pp-section-title">Game Log</h2>
            </div>

            {games.length === 0 && (
              <div className="pp-empty">No games on record yet.</div>
            )}

            {games.map((game) => {
              const opp = fuzzyTeam(game.opponentName);
              const wkLabel = gameLabel(game.matchId, game.exportedAt);
              const hasStats =
                game.passing || game.rushing || game.receiving || game.defense;

              return (
                <div key={game.matchId} className="pp-game-entry">
                  {/* Game header row */}
                  <div className="pp-game-header">
                    <span className="pp-game-wk">{wkLabel}</span>
                    <span className="pp-game-vs">@</span>
                    {opp
                      ? <img className="pp-game-opp-logo" src={opp.logo} alt={opp.nickname} />
                      : null}
                    <span className="pp-game-opp-name">{game.opponentName ?? 'Unknown'}</span>
                    <span className={`pp-game-result pp-game-result--${game.won === true ? 'w' : game.won === false ? 'l' : 'f'}`}>
                      {game.won === true ? 'W' : game.won === false ? 'L' : 'F'}
                      {game.myScore != null && game.opponentScore != null
                        ? ` ${game.myScore}–${game.opponentScore}`
                        : ''}
                    </span>
                    <Link href={`/scores/${game.matchId}`} className="pp-game-box-link">box score →</Link>
                  </div>

                  {/* Stat rows */}
                  {hasStats ? (
                    <div className="pp-game-stats">
                      {game.passing  && <PassingRow  p={game.passing}  />}
                      {game.rushing  && <RushingRow  r={game.rushing}  />}
                      {game.receiving && <ReceivingRow r={game.receiving} />}
                      {game.defense  && <DefenseRow  d={game.defense}  />}
                    </div>
                  ) : (
                    <div className="pp-game-stats pp-empty-inline">No stats recorded.</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="pp-sidebar">

          {/* Player Info */}
          <div className="pp-section-card">
            <div className="pp-section-head">
              <h2 className="pp-section-title">Player Info</h2>
            </div>
            <div className="pp-info-table">
              <div className="pp-info-row">
                <span className="pp-info-lbl">Team</span>
                {team
                  ? <span className="pp-info-val pp-info-val--team" style={{ color: team.primaryColor }}>{team.city} {team.nickname}</span>
                  : <span className="pp-info-val">{data.teamName ?? '—'}</span>}
              </div>
              <div className="pp-info-row">
                <span className="pp-info-lbl">Position</span>
                <span className="pp-info-val">{position}</span>
              </div>
              <div className="pp-info-row">
                <span className="pp-info-lbl">Games</span>
                <span className="pp-info-val">{ct.gamesPlayed}</span>
              </div>
              <div className="pp-info-row">
                <span className="pp-info-lbl">Roblox ID</span>
                <span className="pp-info-val pp-info-val--mono">{data.userId}</span>
              </div>
            </div>
          </div>

          {/* Career Stats */}
          <div className="pp-section-card">
            <div className="pp-section-head">
              <h2 className="pp-section-title">Career Stats</h2>
            </div>
            <div className="pp-career-stats">
              {hasPassingCareer && (
                <div className="pp-career-block">
                  <div className="pp-career-block-title">Passing</div>
                  <div className="pp-career-grid">
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.passing.yards}</span><span className="pp-career-lbl">YDS</span></div>
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.passing.tds}</span><span className="pp-career-lbl">TD</span></div>
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.passing.completions}/{ct.passing.attempts}</span><span className="pp-career-lbl">CMP</span></div>
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.passing.ints}</span><span className="pp-career-lbl">INT</span></div>
                  </div>
                </div>
              )}
              {hasRushingCareer && (
                <div className="pp-career-block">
                  <div className="pp-career-block-title">Rushing</div>
                  <div className="pp-career-grid">
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.rushing.yards}</span><span className="pp-career-lbl">YDS</span></div>
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.rushing.tds}</span><span className="pp-career-lbl">TD</span></div>
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.rushing.carries}</span><span className="pp-career-lbl">CAR</span></div>
                    <div className="pp-career-cell">
                      <span className="pp-career-num">
                        {rushAvg}
                      </span>
                      <span className="pp-career-lbl">AVG</span>
                    </div>
                  </div>
                </div>
              )}
              {hasReceivingCareer && (
                <div className="pp-career-block">
                  <div className="pp-career-block-title">Receiving</div>
                  <div className="pp-career-grid">
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.receiving.yards}</span><span className="pp-career-lbl">YDS</span></div>
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.receiving.tds}</span><span className="pp-career-lbl">TD</span></div>
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.receiving.receptions}</span><span className="pp-career-lbl">REC</span></div>
                  </div>
                </div>
              )}
              {hasDefenseCareer && (
                <div className="pp-career-block">
                  <div className="pp-career-block-title">Defense</div>
                  <div className="pp-career-grid">
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.defense.tackles}</span><span className="pp-career-lbl">TKL</span></div>
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.defense.interceptions}</span><span className="pp-career-lbl">INT</span></div>
                    <div className="pp-career-cell"><span className="pp-career-num">{ct.defense.sacks}</span><span className="pp-career-lbl">SCK</span></div>
                  </div>
                </div>
              )}
              {!hasPassingCareer && !hasRushingCareer && !hasReceivingCareer && !hasDefenseCareer && (
                <div className="pp-empty">No career stats recorded yet.</div>
              )}
            </div>
          </div>

          {/* Legacy Awards */}
          {legacyAwards.length > 0 && (
            <div className="pp-section-card">
              <div className="pp-section-head">
                <h2 className="pp-section-title">Legacy Awards</h2>
              </div>
              <div className="pp-awards-list">
                {legacyAwards.map((award, i) => (
                  <div key={i} className="pp-award-row" style={{ '--award-accent': award.color } as React.CSSProperties}>
                    <span className="pp-award-trophy">{award.trophy}</span>
                    <div className="pp-award-info">
                      <span className="pp-award-label">{award.label}</span>
                      <span className="pp-award-season">Season {award.season}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="pp-back-row">
        <Link href="/stats" className="pp-back-link">← Back to Stats</Link>
      </div>
    </div>
  );
}
