import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { TEAMS, SCHEDULE, type Game } from '../data/schedule';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlayerRow {
  user_id: number;
  display_name: string;
  headshot_url: string | null;
  team_name: string | null;
  completions?: number; attempts?: number; ints?: number;
  carries?: number; receptions?: number;
  yards?: number; tds?: number;
  tackles?: number; interceptions?: number;
}

type Season = 'all' | '1' | '2' | '3';
type Tab = 'overview' | 'roster';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fuzzyMatchTeam(playerTeamName: string | null, teamCity: string, teamNick: string): boolean {
  if (!playerTeamName) return false;
  const lower = playerTeamName.toLowerCase();
  return lower.includes(teamCity.toLowerCase()) || lower.includes(teamNick.toLowerCase());
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23374151'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='%23d1d5db' font-size='18' font-family='sans-serif'%3E%3F%3C/text%3E%3C/svg%3E";

function useStatCategory(category: string, season: Season) {
  return useQuery({
    queryKey: ['stats', category, season],
    queryFn: async () => {
      const res = await fetch(`/api/stats?category=${category}&season=${season}`);
      if (!res.ok) throw new Error('Failed');
      return res.json() as Promise<{ players: PlayerRow[] }>;
    },
  });
}

// ── Schedule helpers ──────────────────────────────────────────────────────────

interface TeamGame {
  week: number;
  isHome: boolean;
  opponent: string;   // team id
  teamScore: number | null;
  oppScore: number | null;
}

function getTeamSchedule(teamId: string): TeamGame[] {
  const games: TeamGame[] = [];
  Object.entries(SCHEDULE).forEach(([weekKey, matchups]) => {
    const weekNum = parseInt(weekKey.replace('week', ''));
    matchups.forEach((g: Game) => {
      if (g.home === teamId) {
        games.push({ week: weekNum, isHome: true,  opponent: g.away, teamScore: g.homeScore, oppScore: g.awayScore });
      } else if (g.away === teamId) {
        games.push({ week: weekNum, isHome: false, opponent: g.home, teamScore: g.awayScore, oppScore: g.homeScore });
      }
    });
  });
  return games.sort((a, b) => a.week - b.week);
}

function getRecord(games: TeamGame[]): { w: number; l: number } {
  let w = 0, l = 0;
  games.forEach(g => {
    if (g.teamScore !== null && g.oppScore !== null) {
      if (g.teamScore > g.oppScore) w++;
      else l++;
    }
  });
  return { w, l };
}

// ── Position group card ───────────────────────────────────────────────────────

interface PositionGroupProps {
  title: string;
  emoji: string;
  players: PlayerRow[];
  renderStats: (p: PlayerRow) => React.ReactNode;
  statHeaders: string[];
  getStatCells: (p: PlayerRow) => (string | number)[];
  accentColor: string;
}

function PositionGroup({ title, emoji, players, statHeaders, getStatCells, accentColor }: PositionGroupProps) {
  if (players.length === 0) return null;
  return (
    <div className="tr-group">
      <div className="tr-group-header" style={{ borderLeftColor: accentColor }}>
        <span className="tr-group-emoji">{emoji}</span>
        <span className="tr-group-title">{title}</span>
        <span className="tr-group-count">{players.length}</span>
      </div>
      <div className="tr-table-wrap">
        <table className="tr-table">
          <thead>
            <tr>
              <th className="tr-th tr-th--player">Player</th>
              {statHeaders.map(h => <th key={h} className="tr-th tr-th--num">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <tr key={p.user_id} className="tr-row">
                <td className="tr-td tr-td--player">
                  <img
                    className="tr-avatar"
                    src={p.headshot_url || PLACEHOLDER}
                    alt={p.display_name}
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                  />
                  <Link href={`/players/${p.user_id}`} className="tr-name tr-name--link">{p.display_name}</Link>
                </td>
                {getStatCells(p).map((v, i) => (
                  <td key={i} className="tr-td tr-td--num">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Schedule row ──────────────────────────────────────────────────────────────

function ScheduleRow({ game, primaryColor }: { game: TeamGame; primaryColor: string }) {
  const opponent = TEAMS[game.opponent];
  const played = game.teamScore !== null && game.oppScore !== null;
  const won = played && game.teamScore! > game.oppScore!;
  const lost = played && !won;

  return (
    <div className="td-sched-row">
      <span className="td-sched-week">WK {game.week}</span>
      <span className="td-sched-vs">{game.isHome ? 'vs' : 'at'}</span>
      <div className="td-sched-opp">
        {opponent ? (
          <>
            <img
              className="td-sched-opp-logo"
              src={opponent.logo}
              alt={opponent.nickname}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <Link href={`/teams/${game.opponent}`} className="td-sched-opp-name">
              {opponent.city} {opponent.nickname}
            </Link>
          </>
        ) : (
          <span className="td-sched-opp-name">TBD</span>
        )}
      </div>

      <div className="td-sched-result">
        {played ? (
          <>
            <span
              className={`td-sched-badge ${won ? 'td-sched-badge--w' : 'td-sched-badge--l'}`}
              style={won ? { background: primaryColor } : undefined}
            >
              {won ? 'W' : 'L'}
            </span>
            <span className="td-sched-score">
              {game.teamScore} – {game.oppScore}
            </span>
            <Link
              href={`/scores/${findMatchId(game)}`}
              className="td-sched-link"
            >
              stats ↗
            </Link>
          </>
        ) : (
          <span className="td-sched-upcoming">UPCOMING</span>
        )}
      </div>
    </div>
  );
}

// find a rough match id to link to box score (best effort via week + teams)
function findMatchId(_game: TeamGame): string {
  return 'tbd';
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const team = TEAMS[id];
  const [tab, setTab] = useState<Tab>('overview');
  const [season, setSeason] = useState<Season>('3');

  const teamGames = useMemo(() => team ? getTeamSchedule(id) : [], [id, team]);
  const record = useMemo(() => getRecord(teamGames), [teamGames]);

  const passing   = useStatCategory('passing',   season);
  const rushing   = useStatCategory('rushing',   season);
  const receiving = useStatCategory('receiving', season);
  const defense   = useStatCategory('defense',   season);

  const isLoading = passing.isLoading || rushing.isLoading || receiving.isLoading || defense.isLoading;

  const filter = (rows: PlayerRow[] | undefined) =>
    (rows ?? []).filter(p => fuzzyMatchTeam(p.team_name, team?.city ?? '', team?.nickname ?? ''));

  const qbs  = useMemo(() => filter(passing.data?.players),   [passing.data,   team]);
  const rbs  = useMemo(() => filter(rushing.data?.players),   [rushing.data,   team]);
  const wrs  = useMemo(() => filter(receiving.data?.players), [receiving.data, team]);
  const defs = useMemo(() => filter(defense.data?.players),   [defense.data,   team]);

  const SEASONS: { key: Season; label: string; corrupted?: boolean }[] = [
    { key: 'all', label: 'All-time' },
    { key: '1', label: 'S1', corrupted: true },
    { key: '2', label: 'S2', corrupted: true },
    { key: '3', label: 'S3' },
  ];

  if (!team) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2>Team not found</h2>
        <Link href="/teams" className="tr-back">← Back to Teams</Link>
      </div>
    );
  }

  const hasAnyStats = qbs.length + rbs.length + wrs.length + defs.length > 0;

  return (
    <div className="td-page">
      {/* ── Hero ── */}
      <div
        className="td-hero"
        style={{ '--team-color': team.primaryColor, '--team-secondary': team.secondaryColor } as React.CSSProperties}
      >
        <div className="td-hero-inner page-container">
          <Link href="/teams" className="td-back">← Back to teams</Link>
          <div className="td-hero-body">
            <div className="td-hero-left">
              <img className="td-hero-logo" src={team.logo} alt={team.nickname} />
              <div className="td-hero-text">
                <span className="td-hero-city">{team.city}</span>
                <span className="td-hero-nick">{team.nickname}</span>
              </div>
            </div>
            <div className="td-hero-right">
              <span className="td-hero-record">{record.w} – {record.l}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="td-tabs-bar">
        <div className="td-tabs-inner page-container">
          {(['overview', 'roster'] as Tab[]).map(t => (
            <button
              key={t}
              className={`td-tab${tab === t ? ' td-tab--active' : ''}`}
              style={tab === t ? { '--tab-color': team.primaryColor } as React.CSSProperties : undefined}
              onClick={() => setTab(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="td-content page-container">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="td-overview">
            <h2 className="td-section-title">Schedule</h2>
            <div className="td-sched-list">
              {teamGames.length === 0 ? (
                <p className="stats-empty">No schedule data available.</p>
              ) : (
                teamGames.map(g => (
                  <ScheduleRow key={g.week} game={g} primaryColor={team.primaryColor} />
                ))
              )}
            </div>
          </div>
        )}

        {/* ROSTER */}
        {tab === 'roster' && (
          <div className="td-roster">
            {/* Season filter */}
            <div className="tr-season-row">
              <span className="tr-season-label">Season</span>
              {SEASONS.map(({ key, label, corrupted }) => (
                <button
                  key={key}
                  className={`stats-season-btn${season === key ? ' stats-season-btn--active' : ''}${corrupted ? ' stats-season-btn--corrupted' : ''}`}
                  onClick={() => setSeason(key)}
                >
                  {label}
                  {corrupted && <span className="stats-season-corrupt-tag">!</span>}
                </button>
              ))}
            </div>

            {season === '1' || season === '2' ? (
              <div className="stats-corrupted">
                <div className="stats-corrupted-icon">⚠</div>
                <div className="stats-corrupted-title">DATA CORRUPTED</div>
                <div className="stats-corrupted-sub">Season {season} records were lost. Stats from this era are unrecoverable.</div>
              </div>
            ) : isLoading ? (
              <div className="stats-empty">Loading roster…</div>
            ) : !hasAnyStats ? (
              <div className="stats-empty">No stats recorded for {team.city} {team.nickname} yet.</div>
            ) : (
              <div className="tr-groups">
                <PositionGroup
                  title="Quarterbacks"
                  emoji="🎯"
                  players={qbs}
                  renderStats={() => null}
                  statHeaders={['CMP', 'ATT', 'YDS', 'TD', 'INT']}
                  getStatCells={p => [p.completions ?? 0, p.attempts ?? 0, p.yards ?? 0, p.tds ?? 0, p.ints ?? 0]}
                  accentColor={team.primaryColor}
                />
                <PositionGroup
                  title="Running Backs"
                  emoji="🏃"
                  players={rbs}
                  renderStats={() => null}
                  statHeaders={['CAR', 'YDS', 'TD']}
                  getStatCells={p => [p.carries ?? 0, p.yards ?? 0, p.tds ?? 0]}
                  accentColor={team.primaryColor}
                />
                <PositionGroup
                  title="Receivers"
                  emoji="🙌"
                  players={wrs}
                  renderStats={() => null}
                  statHeaders={['REC', 'YDS', 'TD']}
                  getStatCells={p => [p.receptions ?? 0, p.yards ?? 0, p.tds ?? 0]}
                  accentColor={team.primaryColor}
                />
                <PositionGroup
                  title="Defense"
                  emoji="🛡️"
                  players={defs}
                  renderStats={() => null}
                  statHeaders={['TKL', 'INT']}
                  getStatCells={p => [p.tackles ?? 0, p.interceptions ?? 0]}
                  accentColor={team.primaryColor}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
