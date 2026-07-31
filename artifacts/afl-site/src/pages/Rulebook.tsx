import React, { useState, useEffect, useRef } from 'react';

const SECTIONS = [
  { id: 'game-format',     label: 'Game format',           level: 1 },
  { id: 'rosters',         label: 'Rosters & eligibility', level: 1 },
  { id: 'scoring',         label: 'Scoring',               level: 1 },
  { id: 'kickoffs',        label: 'Kickoffs',              level: 1 },
  { id: 'offense',         label: 'Offense',               level: 1 },
  { id: 'defense',         label: 'Defense',               level: 1 },
  { id: 'penalties',       label: 'Penalties',             level: 1 },
  { id: 'special-teams',   label: 'Special teams',         level: 1 },
  { id: 'overtime',        label: 'Overtime',              level: 1 },
  { id: 'conduct',         label: 'Conduct & forfeits',    level: 1 },
];

export default function Rulebook() {
  const [activeId, setActiveId] = useState('game-format');
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, window.scrollY);
      setProgress(Math.min(100, (scrolled / total) * 100));

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(SECTIONS[i].id);
        if (sec && sec.getBoundingClientRect().top <= 120) {
          setActiveId(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="rb-page" ref={contentRef}>
      {/* Progress bar */}
      <div className="rb-progress-bar" style={{ width: `${progress}%` }} />

      {/* Hero header */}
      <div className="rb-hero">
        <div className="rb-hero-inner">
          <span className="rb-kicker">league operations</span>
          <h1 className="rb-main-title">
            EFA Rulebook <span className="rb-year">Season III</span>
          </h1>
          <p className="rb-desc">
            The official rules governing all EFA high school football league
            games — covering format, rosters, scoring, penalties, and conduct.
          </p>
          <div className="rb-meta-row">
            <div className="rb-author">
              <img src="/kamasi-avatar.jpg" alt="kamasi" className="rb-avatar" />
              <div className="rb-author-info">
                <span className="rb-author-name">kamasi</span>
                <span className="rb-author-role">Written by · Commissioner</span>
              </div>
            </div>
            <div className="rb-badges">
              <span className="rb-badge"><span className="rb-badge-key">updated</span> Jul 27, 2026</span>
              <span className="rb-badge"><span className="rb-badge-key">read</span> ~8 min</span>
              <span className="rb-badge"><span className="rb-badge-key">sections</span> {SECTIONS.filter(s => s.level === 1).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body: TOC + Content */}
      <div className="rb-body">
        {/* Sticky TOC */}
        <aside className="rb-toc">
          <p className="rb-toc-title">contents</p>
          <ul className="rb-toc-list">
            {SECTIONS.map((s) => (
              <li key={s.id} className={`rb-toc-item rb-toc-item--l${s.level}`}>
                <button
                  className={`rb-toc-btn${activeId === s.id ? ' rb-toc-btn--active' : ''}`}
                  onClick={() => scrollTo(s.id)}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Rulebook content */}
        <div className="rb-content">

          {/* 1. Game format */}
          <section className="rb-section" id="game-format">
            <h2 className="rb-h2">1. Game format</h2>
            <p className="rb-p">All EFA games are played under a high school football format. Games consist of four quarters and follow standard high school football timing rules unless otherwise noted below.</p>

            <h3 className="rb-h3">Quarter length</h3>
            <p className="rb-p">Each quarter is <b>4 minutes</b> in length, for a total regulation time of <b>20 minutes</b>. The play clock is <b>25 seconds</b> from the moment the referee signals the ball ready for play.</p>

            <h3 className="rb-h3">Halftime</h3>
            <p className="rb-p">Halftime is <b>2 minutes</b>. Teams must be back on the field and ready to kick off within that window. A team that is not ready to resume play at the end of halftime may be penalized a timeout.</p>

            <h3 className="rb-h3">Clock rules</h3>
            <ul className="rb-list">
              <li>The clock stops on all incomplete passes, out-of-bounds plays, scores, and referee timeouts throughout the entire game.</li>
              <li>In the final <b>2 minutes</b> of the 2nd and 4th quarters, the clock also stops after any tackle inbounds until the referee signals the ball ready for play.</li>
              <li>Each team is granted <b>3 timeouts per half</b>. Unused timeouts do not carry over to the next half or overtime.</li>
            </ul>

            <h3 className="rb-h3">Coin toss</h3>
            <p className="rb-p">A coin toss is held before the game. The visiting team calls the toss. The winner chooses to either receive the opening kickoff or defer their choice to the second half. The loser of the toss selects their preferred end zone to defend in the first half. Teams switch ends at the start of the second half and after each overtime period.</p>
          </section>

          {/* 2. Rosters & eligibility */}
          <section className="rb-section" id="rosters">
            <h2 className="rb-h2">2. Rosters & eligibility</h2>
            <p className="rb-p">All players must be officially registered on their team's EFA roster before participating in any game. Playing an unregistered player is grounds for a game forfeit.</p>

            <h3 className="rb-h3">Roster size</h3>
            <ul className="rb-list">
              <li>Each team may carry a maximum of <b>20 players</b> on their active roster.</li>
              <li>A minimum of <b>7 players</b> must be present and ready to play at kickoff. If a team cannot field 7 players, the game is forfeited.</li>
            </ul>

            <h3 className="rb-h3">Player eligibility</h3>
            <ul className="rb-list">
              <li>Players may only compete for the team they are officially rostered on for that season.</li>
              <li>A player who has been <b>suspended</b> by the league is ineligible to play, coach, or appear on the sideline during their suspension period.</li>
              <li>Trade and signing deadlines are set by the league office. Transactions after the deadline render the acquired player ineligible for the remainder of the regular season.</li>
            </ul>

            <div className="rb-callout">
              <div className="rb-callout-head">Field requirements</div>
              <ul className="rb-callout-list">
                <li>Each team must have exactly <b>7 players on the field</b> at the snap — no more, no less</li>
                <li>At least <b>5 players must be on the line of scrimmage</b> at the snap</li>
                <li>Only players lined up at eligible receiver positions (WR, TE, RB) may catch forward passes</li>
                <li>The quarterback is the only player permitted to take a direct snap under center or from shotgun</li>
              </ul>
            </div>
          </section>

          {/* 3. Scoring */}
          <section className="rb-section" id="scoring">
            <h2 className="rb-h2">3. Scoring</h2>
            <p className="rb-p">Scoring follows standard high school football point values.</p>

            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Touchdown</span>
              <span className="rb-penalty-cost"><b>6</b> pts</span>
            </div>
            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Point after touchdown (kick)</span>
              <span className="rb-penalty-cost"><b>1</b> pt</span>
            </div>
            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Two-point conversion</span>
              <span className="rb-penalty-cost"><b>2</b> pts</span>
            </div>
            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Field goal</span>
              <span className="rb-penalty-cost"><b>3</b> pts</span>
            </div>
            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Safety</span>
              <span className="rb-penalty-cost"><b>2</b> pts + possession</span>
            </div>

            <h3 className="rb-h3">Point after touchdown (PAT)</h3>
            <p className="rb-p">After every touchdown, the scoring team elects to attempt either a <b>1-point kick</b> or a <b>2-point conversion</b> from the 3-yard line. The defense may return a blocked or intercepted PAT attempt for 2 points.</p>
            <p className="rb-p"><b>Two-point conversions may only be attempted in the second half.</b> In the first half, teams must kick the extra point.</p>

            <h3 className="rb-h3">Safety</h3>
            <p className="rb-p">A safety is awarded when the ball carrier is tackled in their own end zone, or when the offense commits a penalty in their own end zone. After a safety, the scoring team receives 2 points and the ball via a free kick from the 20-yard line.</p>
          </section>

          {/* 4. Kickoffs */}
          <section className="rb-section" id="kickoffs">
            <h2 className="rb-h2">4. Kickoffs</h2>
            <p className="rb-p">Kickoffs take place at the start of each half, after every touchdown and field goal, and after a safety (free kick).</p>

            <h3 className="rb-h3">Kickoff rules</h3>
            <ul className="rb-list">
              <li>The kicking team lines up at the <b>40-yard line</b> for standard kickoffs.</li>
              <li>The receiving team must have a minimum of <b>4 players</b> in the landing zone between their own 10 and 40-yard lines before the kick.</li>
              <li>Kicking team players may not cross the 40-yard line until the ball is kicked.</li>
              <li>A kickoff that goes out of bounds untouched gives the receiving team the ball at their own <b>40-yard line</b>.</li>
            </ul>

            <h3 className="rb-h3">Touchback</h3>
            <p className="rb-p">If the kicked ball lands in or is downed in the end zone, the receiving team may elect a <b>touchback</b>, placing the ball at their own <b>25-yard line</b>. The receiving team may also choose to return the ball from the end zone — they do so at their own risk of a fumble.</p>

            <h3 className="rb-h3">4th and 25 rule</h3>
            <p className="rb-p">There are no onside kicks in the EFA. Instead, a trailing team may elect the <b>4th and 25 rule</b> in place of a kickoff. The team must convert a 4th down play from their own 25-yard line, gaining at least 25 yards, to retain possession. If they fail to convert, the opposing team takes over at the spot of the ball.</p>
          </section>

          {/* 5. Offense */}
          <section className="rb-section" id="offense">
            <h2 className="rb-h2">5. Offense</h2>

            <h3 className="rb-h3">Line of scrimmage</h3>
            <p className="rb-p">At least <b>5 players</b> must be set on the line of scrimmage when the ball is snapped. Only the players at the two ends of the offensive line and those in the backfield are eligible to receive a forward pass.</p>

            <h3 className="rb-h3">Motion rules</h3>
            <ul className="rb-list">
              <li>Only <b>one player</b> may be in motion at the snap, and that motion must be parallel to or away from the line of scrimmage — not toward it.</li>
              <li>All other offensive players must be set for at least <b>1 full second</b> before the snap.</li>
              <li>Illegal motion (moving toward the line of scrimmage before the snap) results in a <b>5-yard penalty</b>.</li>
            </ul>

            <h3 className="rb-h3">Forward pass rules</h3>
            <ul className="rb-list">
              <li>Only <b>one forward pass</b> per down is permitted, and it must be thrown from behind the line of scrimmage.</li>
              <li>A forward pass that hits the ground, goes out of bounds, or is not caught is ruled <b>incomplete</b> — the ball returns to the previous spot and the down is used.</li>
              <li>Intentional grounding is called when the quarterback throws the ball away with no eligible receiver in the area to avoid a sack. Penalty: <b>loss of down and 10 yards</b>.</li>
            </ul>

            <h3 className="rb-h3">Running plays</h3>
            <p className="rb-p">Ball carriers are down when the game's <b>red line is displayed</b>. The ball is spotted at the point where the carrier's forward progress was stopped.</p>

            <h3 className="rb-h3">4th down</h3>
            <p className="rb-p">Teams may attempt to convert a 4th down at any time. Failure to convert results in a turnover on downs — the opposing team takes over at the spot of the ball. Teams are not required to punt or attempt a field goal on 4th down.</p>

            <h3 className="rb-h3">Stacking and diving</h3>
            <p className="rb-p"><b>Stacking after the snap is legal.</b> Multiple offensive players may occupy the same spot or converge after the ball is snapped, as the game allows it. Stacking before the snap remains governed by normal formation and motion rules.</p>
            <p className="rb-p"><b>Diving is allowed</b> on field goal attempts and after snap stacking. Diving before the snap or in ways that exploit pre-snap positioning are not permitted.</p>
          </section>

          {/* 6. Defense */}
          <section className="rb-section" id="defense">
            <h2 className="rb-h2">6. Defense</h2>

            <h3 className="rb-h3">Alignment</h3>
            <p className="rb-p">All defensive players must be lined up on their side of the line of scrimmage at the snap. A defender who crosses the neutral zone and contacts an offensive player before the snap will be called for <b>encroachment</b> (5 yards, repeat down).</p>

            <h3 className="rb-h3">Pass coverage</h3>
            <p className="rb-p">Defensive backs may jam a receiver within <b>5 yards</b> of the line of scrimmage. Beyond that, contact that impedes a receiver's route before the ball arrives is <b>pass interference</b>.</p>

            <h3 className="rb-h3">Interceptions</h3>
            <p className="rb-p">Any defensive player may intercept a forward pass and advance the ball. If the intercepting player goes out of bounds during the return, the ball is spotted where they stepped out.</p>

            <h3 className="rb-h3">Fumble recovery</h3>
            <p className="rb-p">Either team may recover a fumble and advance the ball. A fumble that goes out of bounds is awarded to the team that last possessed the ball, spotted at the point where it crossed the sideline.</p>
          </section>

          {/* 7. Penalties */}
          <section className="rb-section" id="penalties">
            <h2 className="rb-h2">7. Penalties</h2>
            <p className="rb-p">The offended team always has the right to <b>accept or decline</b> a penalty. All yardage penalties are measured from the previous line of scrimmage unless otherwise noted.</p>

            <h3 className="rb-h3">Offensive penalties</h3>

            <div className="rb-penalty-row">
              <span className="rb-penalty-name">False start</span>
              <span className="rb-penalty-cost"><b>5</b> yds · repeat down</span>
            </div>
            <p className="rb-p">An offensive player simulates the snap or moves illegally before the snap.</p>

            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Illegal motion</span>
              <span className="rb-penalty-cost"><b>5</b> yds · repeat down</span>
            </div>
            <p className="rb-p">More than one player in motion, or a player moving toward the line before the snap.</p>

            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Offensive holding</span>
              <span className="rb-penalty-cost"><b>10</b> yds · repeat down</span>
            </div>
            <p className="rb-p">An offensive player grabs or hooks a defender to prevent them from making a play.</p>

            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Intentional grounding</span>
              <span className="rb-penalty-cost"><b>10</b> yds · loss of down</span>
            </div>
            <p className="rb-p">Quarterback throws away a forward pass to avoid a sack with no eligible receiver nearby.</p>

            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Ineligible receiver downfield</span>
              <span className="rb-penalty-cost"><b>5</b> yds · loss of down</span>
            </div>
            <p className="rb-p">A lineman crosses the line of scrimmage before a forward pass is thrown.</p>

            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Illegal block in the back</span>
              <span className="rb-penalty-cost"><b>10</b> yds</span>
            </div>
            <p className="rb-p">Blocking a defender from behind, outside the blocking zone, during a run or return.</p>

            <h3 className="rb-h3">Defensive penalties</h3>

            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Offside / encroachment</span>
              <span className="rb-penalty-cost"><b>5</b> yds · repeat down</span>
            </div>
            <p className="rb-p">A defender crosses the line of scrimmage before the snap.</p>

            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Pass interference</span>
              <span className="rb-penalty-cost">Spot foul · automatic 1st down</span>
            </div>
            <p className="rb-p">Contact with a receiver beyond 5 yards that impedes their ability to catch a catchable pass.</p>

            <div className="rb-penalty-row">
              <span className="rb-penalty-name">Defensive holding</span>
              <span className="rb-penalty-cost"><b>5</b> yds · automatic 1st down</span>
            </div>
            <p className="rb-p">A defender grabs or holds a receiver or blocker who does not have the ball.</p>
          </section>

          {/* 8. Special teams */}
          <section className="rb-section" id="special-teams">
            <h2 className="rb-h2">8. Special teams</h2>

            <h3 className="rb-h3">Punts</h3>
            <ul className="rb-list">
              <li>The punt team must have at least <b>4 gunners</b> on the line of scrimmage at the snap.</li>
              <li>A muffed punt that hits the ground may be recovered by either team, but only the returning team may advance it.</li>
              <li>A punt that goes out of bounds is spotted at the point it crossed the sideline. A punt that rolls into the end zone and is downed results in a touchback to the 25.</li>
            </ul>

            <h3 className="rb-h3">Field goals</h3>
            <ul className="rb-list">
              <li>Field goals may only be attempted from <b>within the opponent's 35-yard line</b>. The line of scrimmage must be at or inside the 35 when the ball is snapped.</li>
              <li>Field goals must be kicked <b>inside the uprights</b>. The game will detect kicks that miss the uprights and rule them no good.</li>
              <li><b>Diving is allowed</b> on field goal attempts by either team.</li>
              <li>A missed field goal that does not reach the end zone is returned to the line of scrimmage. A miss that reaches or passes through the end zone is a touchback for the defense (ball at the 25).</li>
              <li>Fake punts and fake field goals are permitted but are subject to normal formation rules.</li>
            </ul>

            <h3 className="rb-h3">Blocked kicks</h3>
            <p className="rb-p">A blocked punt or field goal may be recovered and advanced by either team. If a blocked kick is recovered in the end zone by the kicking team, it is ruled a touchback. If the defense recovers in the end zone, it is a <b>touchdown</b>.</p>
          </section>

          {/* 9. Overtime */}
          <section className="rb-section" id="overtime">
            <h2 className="rb-h2">9. Overtime</h2>
            <p className="rb-p">If the score is tied at the end of regulation, the game proceeds to overtime using the <b>Kansas City tiebreaker format</b>.</p>

            <h3 className="rb-h3">Format</h3>
            <ul className="rb-list">
              <li>Each team receives one possession beginning at the opponent's <b>10-yard line</b>.</li>
              <li>There are no kickoffs in overtime. Possessions alternate.</li>
              <li>Each team has a full set of 4 downs to score.</li>
              <li>The team that wins the overtime coin toss may choose to go first or second. The away team calls the toss.</li>
            </ul>

            <h3 className="rb-h3">Scoring resolution</h3>
            <ul className="rb-list">
              <li>If Team A (going first) scores a <b>touchdown</b>, Team B must score a touchdown <b>and</b> convert a 2-point conversion to win, or score a touchdown without a conversion to extend overtime.</li>
              <li>If Team A kicks a <b>field goal</b>, Team B can win with a touchdown, tie with a field goal (extending overtime), or lose by failing to score.</li>
              <li>If Team A fails to score, Team B wins by scoring any points. If Team B also fails to score, overtime extends.</li>
            </ul>

            <h3 className="rb-h3">Extended overtime</h3>
            <p className="rb-p">Starting in the <b>3rd overtime period</b>, teams <b>must</b> attempt a 2-point conversion after every touchdown. No PAT kicks are permitted from the 3rd OT onward. Overtime periods continue until a winner is determined — there are no ties in EFA regular season or postseason play.</p>
          </section>

          {/* 10. Conduct & forfeits */}
          <section className="rb-section" id="conduct">
            <h2 className="rb-h2">10. Conduct & forfeits</h2>

            <h3 className="rb-h3">Sportsmanship</h3>
            <p className="rb-p">All players, coaches, and team affiliates are expected to maintain respectful conduct at all times. EFA holds all participants to a high standard of sportsmanship — both in-game and in any public league communications.</p>
            <ul className="rb-list">
              <li>A player who receives <b>two unsportsmanlike conduct penalties</b> in a single game is automatically ejected.</li>
              <li>Coaches are responsible for the conduct of their players and sideline staff. Repeated violations by a team's personnel may result in a <b>team fine or suspension</b> at the commissioner's discretion.</li>
            </ul>

            <h3 className="rb-h3">Game-altering commands</h3>
            <p className="rb-p">Players, Head Coaches, and Athletic Directors may not use game-altering commands during league games. This includes commands such as <b>:blos</b>, <b>:flipfd</b>, or any similar command that changes field conditions, lighting, or gameplay mechanics.</p>
            <div className="rb-callout rb-callout--warn">
              <div className="rb-callout-head">Penalty</div>
              <ul className="rb-callout-list">
                <li>Any player or staff member who uses a game-altering command is <b>suspended for the entire quarter</b> in which the command was used.</li>
                <li>If the command is used with <b>less than 2 minutes remaining</b> in the quarter, the suspension carries over to the next quarter.</li>
              </ul>
            </div>

            <h3 className="rb-h3">Ejections</h3>
            <p className="rb-p">A player who is ejected must immediately leave the playing area. They are ineligible to return for the remainder of that game and must serve a minimum <b>1-game suspension</b> to be reviewed by the league office. Further incidents escalate at commissioner discretion.</p>

            <h3 className="rb-h3">Forfeits</h3>
            <div className="rb-callout rb-callout--warn">
              <div className="rb-callout-head">Forfeit condition</div>
              <ul className="rb-callout-list">
                <li>A team that <b>cannot field 7 eligible players</b> at kickoff forfeits the game — and the responsible coach or team representative is <b>suspended from the league</b></li>
              </ul>
              <p className="rb-callout-note">Forfeits are recorded as a <b>0–1 loss</b> for the forfeiting team and a <b>1–0 win</b> for the opponent. The opponent's point differential is not affected.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
