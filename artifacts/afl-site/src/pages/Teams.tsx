import React from 'react';
import { Link } from 'wouter';
import { TEAMS } from '../data/schedule';

const TEAM_LIST = Object.values(TEAMS);

export default function Teams() {
  return (
    <div className="teams-page page-container">
      <h1 className="teams-heading">Teams</h1>
      <p className="teams-sub">Season 3 — {TEAM_LIST.length} teams</p>

      <div className="teams-grid">
        {TEAM_LIST.map((team) => (
          <Link key={team.id} href={`/teams/${team.id}`}>
            <div
              className="team-card team-card--clickable"
              style={{ '--card-color': team.primaryColor } as React.CSSProperties}
            >
              <div className="team-card-logo">
                <img src={team.logo} alt={`${team.city} ${team.nickname} logo`} />
              </div>
              <span className="team-card-city">{team.city}</span>
              <span className="team-card-nick">{team.nickname}</span>
              <span className="team-card-cta">View Team →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
