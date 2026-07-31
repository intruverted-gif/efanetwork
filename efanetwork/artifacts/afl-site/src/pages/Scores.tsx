import React from 'react';
import { useParams, Link } from 'wouter';
import { TEAMS, SCHEDULE } from '../data/schedule';
import BoxScore from './BoxScore';

const WEEKS = ['week1', 'week2', 'week3', 'week4', 'week5', 'week6'];
const WEEK_LABELS: Record<string, string> = {
  week1: 'Week 1', week2: 'Week 2', week3: 'Week 3',
  week4: 'Week 4', week5: 'Week 5', week6: 'Week 6',
};

export default function Scores() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? 'week1';

  // If the param doesn't look like a week slug, treat it as a matchId
  if (!WEEKS.includes(id)) {
    return <BoxScore matchId={id} />;
  }

  const week = id;
  const games = SCHEDULE[week] ?? [];

  return (
    <div className="scores-page">
      {/* Week tabs */}
      <div className="scores-tabs">
        {WEEKS.map((w) => (
          <Link key={w} href={`/scores/${w}`}>
            <span className={`scores-tab${w === week ? ' scores-tab--active' : ''}`}>
              {WEEK_LABELS[w]}
            </span>
          </Link>
        ))}
      </div>

      {/* Schedule */}
      <div className="scores-body">
        <div className="scores-week-header">
          <span className="scores-week-label">{WEEK_LABELS[week]}</span>
          <span className="scores-week-badge">SCHEDULED</span>
        </div>

        <div className="scores-list">
          {games.map((game, i) => {
            const home = TEAMS[game.home];
            const away = TEAMS[game.away];
            const isPlayed = game.homeScore !== null && game.awayScore !== null;
            const homeWon = isPlayed && game.homeScore! > game.awayScore!;
            const awayWon = isPlayed && game.awayScore! > game.homeScore!;

            return (
              <div key={i} className={`sg-card${isPlayed ? ' sg-card--final' : ''}`}>
                {/* Home row */}
                <div className={`sg-team-row${homeWon ? ' sg-team-row--winner' : ''}${isPlayed && !homeWon ? ' sg-team-row--loser' : ''}`}>
                  <img
                    className="sg-logo"
                    src={home.logo}
                    alt={home.nickname}
                    style={{ '--team-color': home.primaryColor } as React.CSSProperties}
                  />
                  <div className="sg-name-block">
                    <span className="sg-city">{home.city}</span>
                    <span className="sg-nick">{home.nickname}</span>
                  </div>
                  <span className="sg-ha-tag">HOME</span>
                  <span className="sg-score">
                    {isPlayed ? game.homeScore : '—'}
                  </span>
                </div>

                {/* Away row */}
                <div className={`sg-team-row${awayWon ? ' sg-team-row--winner' : ''}${isPlayed && !awayWon ? ' sg-team-row--loser' : ''}`}>
                  <img
                    className="sg-logo"
                    src={away.logo}
                    alt={away.nickname}
                    style={{ '--team-color': away.primaryColor } as React.CSSProperties}
                  />
                  <div className="sg-name-block">
                    <span className="sg-city">{away.city}</span>
                    <span className="sg-nick">{away.nickname}</span>
                  </div>
                  <span className="sg-ha-tag">AWAY</span>
                  <span className="sg-score">
                    {isPlayed ? game.awayScore : '—'}
                  </span>
                </div>

                {/* Footer */}
                <div className="sg-card-footer">
                  <span className={`sg-status${isPlayed ? ' sg-status--final' : ''}`}>
                    {isPlayed ? 'FINAL' : 'UPCOMING'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
