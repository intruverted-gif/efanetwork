import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { TEAMS } from '../data/schedule';

// ── Types ────────────────────────────────────────────────────────────────────

interface PlayerStats {
  userId: number;
  displayName: string;
  headshotUrl: string | null;
  teamSide: 'home' | 'away';
  teamName: string;
  passing?: { completions: number; attempts: number; yards: number; tds: number; ints: number };
  rushing?: { carries: number; yards: number; tds: number };
  receiving?: { receptions: number; yards: number; tds: number };
  defense?: { tackles: number; interceptions: number };
}

interface MatchData {
  matchId: string;
  season: number;
  exportedAt: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  players: PlayerStats[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fuzzyTeam(name: string) {
  const lower = name.toLowerCase();
  for (const t of Object.values(TEAMS)) {
    if (lower.includes(t.city.toLowerCase()) || lower.includes(t.nickname.toLowerCase())) {
      return t;
    }
  }
  return null;
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23374151'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='%23d1d5db' font-size='18' font-family='sans-serif'%3E%3F%3C/text%3E%3C/svg%3E";

function fmt(n: number | undefined, fallback = '—') {
  if (n === undefined || n === null) return fallback;
  return String(n);
}

// ── Stat line rows per category ───────────────────────────────────────────────

function PlayerCard({ player }: { player: PlayerStats }) {
  const hasStats = player.passing || player.rushing || player.receiving || player.defense;

  return (
    <div className="bs-player">
      <div className="bs-player-header">
        <img
          className="bs-avatar"
          src={player.headshotUrl || PLACEHOLDER}
          alt={player.displayName}
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
        <span className="bs-player-name">{player.displayName}</span>
      </div>
      {!hasStats && <p className="bs-no-stats">No recorded stats</p>}
      {player.passing && (
        <div className="bs-stat-group">
          <span className="bs-stat-label">PASSING</span>
          <div className="bs-stat-row">
            <span className="bs-stat-item"><span className="bs-stat-val">{player.passing.completions}/{player.passing.attempts}</span><span className="bs-stat-key">CMP/ATT</span></span>
            <span className="bs-stat-item"><span className="bs-stat-val">{player.passing.yards}</span><span className="bs-stat-key">YDS</span></span>
            <span className="bs-stat-item"><span className="bs-stat-val">{player.passing.tds}</span><span className="bs-stat-key">TD</span></span>
            <span className="bs-stat-item"><span className="bs-stat-val">{player.passing.ints}</span><span className="bs-stat-key">INT</span></span>
          </div>
        </div>
      )}
      {player.rushing && (
        <div className="bs-stat-group">
          <span className="bs-stat-label">RUSHING</span>
          <div className="bs-stat-row">
            <span className="bs-stat-item"><span className="bs-stat-val">{player.rushing.carries}</span><span className="bs-stat-key">CAR</span></span>
            <span className="bs-stat-item"><span className="bs-stat-val">{player.rushing.yards}</span><span className="bs-stat-key">YDS</span></span>
            <span className="bs-stat-item"><span className="bs-stat-val">{player.rushing.tds}</span><span className="bs-stat-key">TD</span></span>
          </div>
        </div>
      )}
      {player.receiving && (
        <div className="bs-stat-group">
          <span className="bs-stat-label">RECEIVING</span>
          <div className="bs-stat-row">
            <span className="bs-stat-item"><span className="bs-stat-val">{player.receiving.receptions}</span><span className="bs-stat-key">REC</span></span>
            <span className="bs-stat-item"><span className="bs-stat-val">{player.receiving.yards}</span><span className="bs-stat-key">YDS</span></span>
            <span className="bs-stat-item"><span className="bs-stat-val">{player.receiving.tds}</span><span className="bs-stat-key">TD</span></span>
          </div>
        </div>
      )}
      {player.defense && (
        <div className="bs-stat-group">
          <span className="bs-stat-label">DEFENSE</span>
          <div className="bs-stat-row">
            <span className="bs-stat-item"><span className="bs-stat-val">{player.defense.tackles}</span><span className="bs-stat-key">TKL</span></span>
            <span className="bs-stat-item"><span className="bs-stat-val">{player.defense.interceptions}</span><span className="bs-stat-key">INT</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BoxScore({ matchId }: { matchId: string }) {
  const { data, isLoading, isError } = useQuery<MatchData>({
    queryKey: ['match', matchId],
    queryFn: async () => {
      const res = await fetch(`/api/matches/${matchId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('not_found');
        throw new Error('server_error');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="bs-page"><div className="bs-loading">Loading box score…</div></div>;
  }

  if (isError || !data) {
    return (
      <div className="bs-page">
        <div className="bs-error">
          <p>{isError ? 'Match not found.' : 'Failed to load match.'}</p>
          <Link href="/scores/week1" className="bs-back">← Back to Scores</Link>
        </div>
      </div>
    );
  }

  const homePlayers = data.players.filter((p) => p.teamSide === 'home');
  const awayPlayers = data.players.filter((p) => p.teamSide === 'away');
  const homeTeam = fuzzyTeam(data.homeTeamName);
  const awayTeam = fuzzyTeam(data.awayTeamName);
  const homeWon = data.homeScore > data.awayScore;
  const awayWon = data.awayScore > data.homeScore;

  const exportDate = new Date(data.exportedAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="bs-page">
      <div className="bs-nav">
        <Link href="/scores/week1" className="bs-back">← Scores</Link>
        <span className="bs-match-id">Match ID: {data.matchId}</span>
        <span className="bs-date">{exportDate} · Season {data.season}</span>
      </div>

      {/* Scoreboard */}
      <div className="bs-scoreboard">
        <div className={`bs-sb-team${homeWon ? ' bs-sb-team--winner' : ''}`}>
          {homeTeam ? (
            <img className="bs-sb-logo" src={homeTeam.logo} alt={homeTeam.nickname} />
          ) : (
            <div className="bs-sb-logo-placeholder" />
          )}
          <span className="bs-sb-name">{data.homeTeamName}</span>
          <span className="bs-sb-tag">HOME</span>
          <span className={`bs-sb-score${homeWon ? ' bs-sb-score--winner' : ''}`}>
            {data.homeScore}
          </span>
        </div>

        <div className="bs-sb-divider">FINAL</div>

        <div className={`bs-sb-team${awayWon ? ' bs-sb-team--winner' : ''}`}>
          <span className={`bs-sb-score${awayWon ? ' bs-sb-score--winner' : ''}`}>
            {data.awayScore}
          </span>
          <span className="bs-sb-tag">AWAY</span>
          <span className="bs-sb-name">{data.awayTeamName}</span>
          {awayTeam ? (
            <img className="bs-sb-logo" src={awayTeam.logo} alt={awayTeam.nickname} />
          ) : (
            <div className="bs-sb-logo-placeholder" />
          )}
        </div>
      </div>

      {/* Player stats */}
      <div className="bs-teams">
        <div className="bs-team-col">
          <div className="bs-team-header" style={{ borderColor: homeTeam?.primaryColor || '#c20211' }}>
            <span className="bs-team-label">{data.homeTeamName}</span>
          </div>
          {homePlayers.length === 0
            ? <p className="bs-no-players">No player data</p>
            : homePlayers.map((p) => <PlayerCard key={p.userId} player={p} />)
          }
        </div>

        <div className="bs-team-col">
          <div className="bs-team-header" style={{ borderColor: awayTeam?.primaryColor || '#c20211' }}>
            <span className="bs-team-label">{data.awayTeamName}</span>
          </div>
          {awayPlayers.length === 0
            ? <p className="bs-no-players">No player data</p>
            : awayPlayers.map((p) => <PlayerCard key={p.userId} player={p} />)
          }
        </div>
      </div>
    </div>
  );
}
