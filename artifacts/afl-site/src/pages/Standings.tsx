import React, { useState } from 'react';
import { TEAMS, SCHEDULE } from '../data/schedule';

interface TeamStat {
  id: string;
  w: number;
  l: number;
  pf: number;
  pa: number;
  pd: number;
}

function computeStandings(): TeamStat[] {
  const stats: Record<string, TeamStat> = {};

  for (const id of Object.keys(TEAMS)) {
    stats[id] = { id, w: 0, l: 0, pf: 0, pa: 0, pd: 0 };
  }

  for (const games of Object.values(SCHEDULE)) {
    for (const game of games) {
      if (game.homeScore === null || game.awayScore === null) continue;
      const h = stats[game.home];
      const a = stats[game.away];
      if (!h || !a) continue;

      h.pf += game.homeScore;
      h.pa += game.awayScore;
      a.pf += game.awayScore;
      a.pa += game.homeScore;

      if (game.homeScore > game.awayScore) {
        h.w++; a.l++;
      } else if (game.awayScore > game.homeScore) {
        a.w++; h.l++;
      }
    }
  }

  return Object.values(stats)
    .map((s) => ({ ...s, pd: s.pf - s.pa }))
    .sort((a, b) =>
      b.w !== a.w ? b.w - a.w :
      b.pd !== a.pd ? b.pd - a.pd :
      b.pf - a.pf
    );
}

type Filter = 'both' | 't4' | 'bot';

export default function Standings() {
  const [filter, setFilter] = useState<Filter>('both');
  const rows = computeStandings();
  const top4   = rows.slice(0, 4);
  const bottom = rows.slice(4);

  const COLS = 8; // #, Team, W, L, PF, PA, PD

  const renderRow = (stat: TeamStat, rank: number) => {
    const team = TEAMS[stat.id];
    if (!team) return null;
    const isTop = rank <= 4;
    const pdStr = stat.pd > 0 ? `+${stat.pd}` : `${stat.pd}`;
    return (
      <tr key={stat.id} className={`std-row${isTop ? ' std-row--top' : ' std-row--bot'}`}>
        <td className="std-td std-td--rank">
          <span className={`std-rank-badge${isTop ? ' std-rank-badge--top' : ''}`}>{rank}</span>
        </td>
        <td className="std-td std-td--team">
          <span className="std-team-inner">
            <img src={team.logo} alt={team.nickname} className="std-team-logo" />
            <span className="std-team-name">
              {team.city.toUpperCase()} <strong>{team.nickname.toUpperCase()}</strong>
            </span>
          </span>
        </td>
        <td className="std-td">{stat.w}</td>
        <td className="std-td">{stat.l}</td>
        <td className="std-td">{stat.pf}</td>
        <td className="std-td">{stat.pa}</td>
        <td className="std-td std-td--pd">{pdStr}</td>
      </tr>
    );
  };

  return (
    <div className="std-page">
      {/* Filter tabs */}
      <div className="std-filter-bar">
        {(['both', 't4', 'bot'] as Filter[]).map((f) => (
          <button
            key={f}
            className={`std-filter-btn${filter === f ? ' std-filter-btn--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'both' ? 'BOTH' : f === 't4' ? 'T4' : 'BOT'}
          </button>
        ))}
      </div>

      <div className="std-card">
        {/* Card header */}
        <div className="std-card-head">
          <span className="std-card-league">EFA</span>
          <span className="std-card-title">OVERALL STANDINGS</span>
        </div>

        <div className="std-table-wrap">
          <table className="std-table">
            <thead>
              <tr>
                <th className="std-th std-th--rank">#</th>
                <th className="std-th std-th--team">TEAM</th>
                <th className="std-th">W</th>
                <th className="std-th">L</th>
                <th className="std-th">PF</th>
                <th className="std-th">PA</th>
                <th className="std-th">PD</th>
              </tr>
            </thead>
            <tbody>
              {(filter === 'both' || filter === 't4') && (
                <>
                  <tr className="std-divider std-divider--top">
                    <td colSpan={COLS}>TOP 4</td>
                  </tr>
                  {top4.map((s, i) => renderRow(s, i + 1))}
                </>
              )}

              {(filter === 'both' || filter === 'bot') && (
                <>
                  <tr className="std-divider std-divider--bot">
                    <td colSpan={COLS}>BOTTOM BARREL</td>
                  </tr>
                  {bottom.map((s, i) => renderRow(s, i + 5))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
