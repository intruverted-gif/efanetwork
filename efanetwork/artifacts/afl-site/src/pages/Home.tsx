import React, { useState, useMemo, useRef } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Link } from 'wouter';
import { TEAMS, SCHEDULE } from '../data/schedule';
import { VIDEOS } from '../data/mockData';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlayerRow {
  user_id: number;
  display_name: string;
  headshot_url: string | null;
  team_name: string | null;
  completions?: number; attempts?: number; ints?: number;
  carries?: number;
  yards?: number; tds?: number; receptions?: number;
  tackles?: number; interceptions?: number; sacks?: number;
}

interface AwardPlayer {
  userId: number;
  name: string;
  headshotUrl: string | null;
  teamName: string | null;
  position: string;
  impact: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23374151'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='%23d1d5db' font-size='18' font-family='sans-serif'%3E%3F%3C/text%3E%3C/svg%3E";

function fuzzyTeam(name: string | null) {
  if (!name) return null;
  const lower = name.toLowerCase();
  for (const t of Object.values(TEAMS)) {
    if (lower.includes(t.city.toLowerCase()) || lower.includes(t.nickname.toLowerCase())) return t;
  }
  return null;
}

function computeStandings() {
  const stats: Record<string, { id: string; w: number; l: number; pf: number; pa: number }> = {};
  for (const id of Object.keys(TEAMS)) stats[id] = { id, w: 0, l: 0, pf: 0, pa: 0 };
  for (const games of Object.values(SCHEDULE)) {
    for (const game of games) {
      if (game.homeScore === null || game.awayScore === null) continue;
      const h = stats[game.home]; const a = stats[game.away];
      if (!h || !a) continue;
      h.pf += game.homeScore; h.pa += game.awayScore;
      a.pf += game.awayScore; a.pa += game.homeScore;
      if (game.homeScore > game.awayScore) { h.w++; a.l++; }
      else if (game.awayScore > game.homeScore) { a.w++; h.l++; }
    }
  }
  return Object.values(stats)
    .map(s => ({ ...s, pd: s.pf - s.pa }))
    .sort((a, b) => b.w - a.w || (b.pf - b.pa) - (a.pf - a.pa) || b.pf - a.pf);
}

function getCurrentWeek(): string {
  const weeks = Object.keys(SCHEDULE);
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (SCHEDULE[weeks[i]].some(g => g.homeScore !== null)) return weeks[i];
  }
  return weeks[0];
}

// ── Stat leader options ───────────────────────────────────────────────────────

const LEADER_OPTS = [
  { label: 'Passing YDS', category: 'passing',   statKey: 'yards'   },
  { label: 'Rushing YDS', category: 'rushing',   statKey: 'yards'   },
  { label: 'Rec YDS',     category: 'receiving', statKey: 'yards'   },
  { label: 'Tackles',     category: 'defense',   statKey: 'tackles' },
  { label: 'Sacks',       category: 'defense',   statKey: 'sacks'   },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [leaderIdx, setLeaderIdx] = useState(0);
  const videoViewportRef = useRef<HTMLDivElement>(null);
  const currentWeek = useMemo(getCurrentWeek, []);
  const weekLabel   = currentWeek.replace('week', 'Week ');
  const weekGames   = SCHEDULE[currentWeek] ?? [];
  const standings   = useMemo(computeStandings, []);
  const selectedOpt = LEADER_OPTS[leaderIdx];

  // ── Award Watch: fetch all 4 categories ──────────────────────────────────
  const awResults = useQueries({
    queries: (['passing', 'rushing', 'receiving', 'defense'] as const).map(cat => ({
      queryKey: ['stats', cat, '3'],
      queryFn: async () => {
        const res = await fetch(`/api/stats?category=${cat}&season=3`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json() as { players: PlayerRow[] };
        return { category: cat, players: data.players };
      },
      refetchInterval: 30_000,
      staleTime: 20_000,
    })),
  });

  const awardPlayers = useMemo<AwardPlayer[]>(() => {
    if (!awResults.every(r => r.data)) return [];
    const n = (v: unknown) => Number(v) || 0;
    const map = new Map<number, AwardPlayer>();

    for (const result of awResults) {
      if (!result.data) continue;
      const { category, players } = result.data;
      for (const p of players) {
        let raw = 0;
        let pos = '';
        if (category === 'passing') {
          raw = n(p.yards)*0.06 + n(p.tds)*10 + n(p.completions)*0.4 - n(p.ints)*5;
          pos = 'QB';
        } else if (category === 'rushing') {
          raw = n(p.yards)*0.12 + n(p.tds)*10 + n(p.carries)*0.5;
          pos = 'RB';
        } else if (category === 'receiving') {
          raw = n(p.yards)*0.12 + n(p.tds)*10 + n(p.receptions)*2;
          pos = 'WR';
        } else {
          raw = n(p.tackles)*2.5 + n(p.interceptions)*10 + n(p.sacks)*6;
          pos = 'DEF';
        }
        const existing = map.get(p.user_id);
        if (!existing || raw > existing.impact) {
          map.set(p.user_id, {
            userId: p.user_id, name: p.display_name,
            headshotUrl: p.headshot_url, teamName: p.team_name,
            position: pos, impact: raw,
          });
        }
      }
    }

    const sorted = [...map.values()].sort((a, b) => b.impact - a.impact);
    const maxImpact = sorted[0]?.impact || 1;
    return sorted.slice(0, 10).map(p => ({
      ...p,
      impact: Math.min(99.9, (p.impact / maxImpact) * 99),
    }));
  }, [awResults]);

  // ── Stat leaders ──────────────────────────────────────────────────────────
  const { data: leaderData, isLoading: leaderLoading } = useQuery({
    queryKey: ['stats', selectedOpt.category, '3'],
    queryFn: async () => {
      const res = await fetch(`/api/stats?category=${selectedOpt.category}&season=3`);
      if (!res.ok) throw new Error('Failed');
      return res.json() as Promise<{ players: PlayerRow[] }>;
    },
    refetchInterval: 30_000,
    staleTime: 20_000,
  });

  const leaders = useMemo(() => {
    const rows = leaderData?.players ?? [];
    const key = selectedOpt.statKey;
    return [...rows]
      .sort((a, b) => (Number((b as any)[key]) || 0) - (Number((a as any)[key]) || 0))
      .slice(0, 5);
  }, [leaderData, selectedOpt]);

  const awLoading = awResults.some(r => r.isLoading);

  const scrollVideos = (dir: number) => {
    const vp = videoViewportRef.current;
    if (!vp) return;
    const card = vp.querySelector('.vc-card') as HTMLElement | null;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(vp).fontSize || '16') || 16;
    vp.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="home-main">
      <div className="container">

        {/* ── Hero Banner ─────────────────────────────────────────────── */}
        <div className="hp-hero" />

        {/* ── Latest Videos ───────────────────────────────────────────── */}
        <div className="video-carousel">
          <div className="vc-head">
            <span className="vc-title">latest videos</span>
            <div className="vc-arrows">
              <button className="vc-arrow" aria-label="Previous" onClick={() => scrollVideos(-1)}>‹</button>
              <button className="vc-arrow" aria-label="Next" onClick={() => scrollVideos(1)}>›</button>
            </div>
          </div>
          <div className="vc-viewport" ref={videoViewportRef}>
            <div className="vc-track">
              {VIDEOS.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vc-card"
                >
                  <div className="vc-thumb">
                    <img src={video.thumbnail} alt={video.title} loading="lazy" />
                    <div className="vc-play" />
                  </div>
                  <div className="vc-card-title">{video.title}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main grid ───────────────────────────────────────────────── */}
        <div className="home-grid">

          {/* Left column: Award Watch + Matchups */}
          <div className="home-main-col">

            {/* Award Watch */}
            <div className="home-card home-awards-card">
              <div className="home-card-head">
                <div className="home-card-title">
                  <h2>AWARD WATCH</h2>
                  <span className="home-pill">LIVE RACE</span>
                </div>
              </div>
              {awLoading && <div className="home-loading">Calculating impact ratings…</div>}
              {!awLoading && awardPlayers.length === 0 && (
                <div className="home-empty">No stats yet — import match data to see rankings.</div>
              )}
              {!awLoading && awardPlayers.length > 0 && (
                <div className="lead-list">
                  {awardPlayers.map((p, i) => (
                    <div key={p.userId} className="lead-row">
                      <span className="lead-rank">{i + 1}</span>
                      <img
                        className="lead-logo"
                        src={p.headshotUrl || PLACEHOLDER}
                        alt={p.name}
                        onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                        style={{ borderRadius: '50%' }}
                      />
                      <span className="lead-name">{p.name}</span>
                      <span className="aw-pos-tag">{p.position}</span>
                      <span className="lead-val">{p.impact.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Matchups */}
            <div className="home-card">
              <div className="home-card-head">
                <div className="home-card-title">
                  <h2>MATCHUPS</h2>
                  <span className="home-pill">{weekLabel.toUpperCase()}</span>
                </div>
                <Link href={`/scores/${currentWeek}`} className="home-select-link">all scores →</Link>
              </div>
              <div className="mu-list">
                {weekGames.map((game, i) => {
                  const home = TEAMS[game.home];
                  const away = TEAMS[game.away];
                  if (!home || !away) return null;
                  const played   = game.homeScore !== null && game.awayScore !== null;
                  const homeWon  = played && game.homeScore! > game.awayScore!;
                  const awayWon  = played && game.awayScore! > game.homeScore!;
                  return (
                    <div key={i} className="mu">
                      <div className={`mu-team${played && !homeWon ? ' mu-lose' : ''}`}>
                        <img src={home.logo} alt={home.nickname} className="mu-logo" />
                        <span className="mu-abbr">{home.nickname}</span>
                      </div>
                      <div className="mu-center">
                        {played ? (
                          <>
                            <span className={`mu-score${homeWon ? ' mu-score--win' : ''}`}>{game.homeScore}</span>
                            <span className="mu-dash">–</span>
                            <span className={`mu-score${awayWon ? ' mu-score--win' : ''}`}>{game.awayScore}</span>
                          </>
                        ) : (
                          <span className="mu-vs">VS</span>
                        )}
                      </div>
                      <div className={`mu-team mu-right${played && !awayWon ? ' mu-lose' : ''}`}>
                        <span className="mu-abbr">{away.nickname}</span>
                        <img src={away.logo} alt={away.nickname} className="mu-logo" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar: Stat Leaders + Standings */}
          <div className="home-sidebar">

            {/* Stat Leaders */}
            <div className="home-card">
              <div className="home-card-head">
                <div className="home-card-title"><h2>STAT LEADERS</h2></div>
                <select
                  className="home-select"
                  value={leaderIdx}
                  onChange={e => setLeaderIdx(Number(e.target.value))}
                >
                  {LEADER_OPTS.map((opt, i) => (
                    <option key={i} value={i}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {leaderLoading && <div className="home-loading">Loading…</div>}
              {!leaderLoading && leaders.length === 0 && <div className="home-empty">No data yet.</div>}
              {!leaderLoading && leaders.length > 0 && (
                <div className="lead-list">
                  {leaders.map((p, i) => {
                    const team = fuzzyTeam(p.team_name);
                    return (
                      <div key={p.user_id} className="lead-row">
                        <span className="lead-rank">{i + 1}</span>
                        <img
                          className="lead-logo"
                          src={team?.logo || PLACEHOLDER}
                          alt={team?.nickname || ''}
                          onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                        />
                        <span className="lead-name">{p.display_name}</span>
                        <span className="lead-val">{(p as any)[selectedOpt.statKey] ?? 0}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Compact Standings */}
            <div className="home-card">
              <div className="home-card-head">
                <div className="home-card-title"><h2>STANDINGS</h2></div>
                <Link href="/standings" className="home-select-link">full →</Link>
              </div>
              <div className="stand-list">
                <div className="stand-divider">TOP 4</div>
                {standings.slice(0, 4).map((s, i) => {
                  const team = TEAMS[s.id];
                  if (!team) return null;
                  return (
                    <Link key={s.id} href="/standings" className="stand-row">
                      <span className="stand-seed">{i + 1}</span>
                      <img src={team.logo} alt={team.nickname} className="stand-logo" />
                      <span className="stand-name">{team.nickname}</span>
                      <span className="stand-record">{s.w}–{s.l}</span>
                    </Link>
                  );
                })}
                <div className="stand-divider">BOTTOM BARREL</div>
                {standings.slice(4).map((s, i) => {
                  const team = TEAMS[s.id];
                  if (!team) return null;
                  return (
                    <Link key={s.id} href="/standings" className="stand-row">
                      <span className="stand-seed">{i + 5}</span>
                      <img src={team.logo} alt={team.nickname} className="stand-logo" />
                      <span className="stand-name">{team.nickname}</span>
                      <span className="stand-record">{s.w}–{s.l}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
