import React, { useEffect, useState } from 'react';

interface TeamInfo {
  logo: string;
  name: string;
  score: number;
  isWinner: boolean;
}

interface MvpInfo {
  headshot: string;
  username: string;
  label?: string;
}

interface Props {
  season: string;
  bowlName: string;
  winner: TeamInfo;
  runnerUp: TeamInfo;
  mvp: MvpInfo;
  accentColor?: string;
  accentRgb?: string;
}

export default function ChampionshipBanner({
  season, bowlName, winner, runnerUp, mvp,
  accentColor = '#FFD700',
  accentRgb = '255,215,0',
}: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // tiny delay so CSS transitions fire after paint
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`cb-wrap${ready ? ' cb-ready' : ''}`}
      style={{ '--cb-accent': accentColor, '--cb-rgb': accentRgb } as React.CSSProperties}>

      {/* ── Background layers ── */}
      <div className="cb-bg" aria-hidden="true">
        <div className="cb-bg-spotlight" />
        <div className="cb-bg-rays" />
        <div className="cb-bg-grid" />
        {[...Array(18)].map((_, i) => (
          <div key={i} className="cb-particle" style={{
            '--delay': `${(i * 0.37) % 3}s`,
            '--dur': `${3.5 + (i * 0.23) % 2.5}s`,
            '--x': `${(i * 17 + 5) % 95}%`,
            '--size': `${2 + (i * 7) % 5}px`,
          } as React.CSSProperties} />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="cb-content">

        {/* Trophy drop */}
        <div className="cb-trophy-wrap cb-anim-trophy">
          <div className="cb-trophy-glow" />
          <span className="cb-trophy-emoji">🏆</span>
        </div>

        {/* Kicker */}
        <div className="cb-kicker cb-anim-1">
          <span className="cb-kicker-line" />
          <span>{season} · EFA Championship</span>
          <span className="cb-kicker-line cb-kicker-line--r" />
        </div>

        {/* Bowl name */}
        <h1 className="cb-bowl cb-anim-2">{bowlName}</h1>

        {/* CHAMPIONS stamp */}
        <div className="cb-champs-stamp cb-anim-3">
          <span className="cb-champs-text">Champions</span>
        </div>

        {/* Matchup */}
        <div className="cb-matchup cb-anim-4">

          {/* Winner */}
          <div className="cb-team cb-team--winner cb-anim-left">
            <div className="cb-logo-wrap">
              <div className="cb-logo-glow" />
              <img src={winner.logo} alt={winner.name} className="cb-logo" />
              <div className="cb-logo-ring" />
            </div>
            <div className="cb-team-name">{winner.name}</div>
            <div className="cb-team-badge">🏆 Champions</div>
          </div>

          {/* Score */}
          <div className="cb-score-block">
            <div className="cb-score-label">Final Score</div>
            <div className="cb-score-row">
              <span className="cb-score-win">{winner.score}</span>
              <span className="cb-score-sep">—</span>
              <span className="cb-score-loss">{runnerUp.score}</span>
            </div>
            <div className="cb-vs-line">vs</div>
          </div>

          {/* Runner-up */}
          <div className="cb-team cb-team--loser cb-anim-right">
            <div className="cb-logo-wrap cb-logo-wrap--loser">
              <img src={runnerUp.logo} alt={runnerUp.name} className="cb-logo cb-logo--loser" />
            </div>
            <div className="cb-team-name cb-team-name--loser">{runnerUp.name}</div>
            <div className="cb-team-badge cb-team-badge--runner">Runner-up</div>
          </div>

        </div>

        {/* MVP */}
        <div className="cb-mvp cb-anim-5">
          <div className="cb-mvp-glow" />
          <img src={mvp.headshot} alt={mvp.username} className="cb-mvp-avatar" />
          <div className="cb-mvp-text">
            <span className="cb-mvp-label">⭐ {mvp.label ?? 'Geico Bowl MVP'}</span>
            <span className="cb-mvp-name">{mvp.username}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
