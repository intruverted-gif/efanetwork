import React from 'react';
import { Link } from 'wouter';
import { Trophy, Star, Shield, Zap, Target, Activity, ChevronLeft } from 'lucide-react';
import { CHAMPIONSHIP_ROSTERS } from '../data/legacyAwards';

const roster = CHAMPIONSHIP_ROSTERS.find((r) => r.season === 2)!;

const PLACEHOLDER = (name: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%230a1628'/%3E%3Ctext x='30' y='39' text-anchor='middle' fill='%23444' font-size='22' font-family='sans-serif'%3E${encodeURIComponent(name[0].toUpperCase())}%3C/text%3E%3C/svg%3E`;

const AWARDS = [
  { title: 'Season MVP',     player: 'rolboxboy272248', Icon: Trophy,   color: '#60a5fa', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C38E62048A2D78CB09BF8B3F1BA4C7F9-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { title: 'QB of the Year', player: 'rolboxboy272248', Icon: Star,     color: '#93c5fd', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C38E62048A2D78CB09BF8B3F1BA4C7F9-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { title: 'RB of the Year', player: 'WorldvsZai',      Icon: Zap,      color: '#a78bfa', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C3898109DA64FC26780801E1E8AA9A42-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { title: 'WR of the Year', player: 'sheluvqub',       Icon: Target,   color: '#f472b6', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-A14851D9F731CB7A40B14F5E884B5575-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { title: 'TE of the Year', player: '1conceptionz',    Icon: Activity, color: '#fb923c', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-6E2E8B2716C721483AEB6524F487E2A4-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { title: 'OL of the Year', player: 'Koolaid_Man603',  Icon: Shield,   color: '#34d399', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-3C4439AFA1B687C9F434023C787B6E67-Png/150/150/AvatarHeadshot/Png/noFilter' },
];

const ACCENT = '#3b82f6';

export default function LegacySeason2() {
  return (
    <div style={{ minHeight: '100vh', background: '#030508', color: '#fff', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* Radial ambient glow — blue for S2 */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(circle at 50% 20%, rgba(10,20,50,0.65) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/standings" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'color .15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
          <ChevronLeft size={16} />
          Back to Standings
        </Link>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/legacy" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', borderBottom: '2px solid transparent', paddingBottom: '0.25rem', textDecoration: 'none', transition: 'color .15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
            SEASON 1
          </Link>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.2em', color: ACCENT, borderBottom: `2px solid ${ACCENT}`, paddingBottom: '0.25rem', cursor: 'default' }}>
            SEASON 2
          </span>
        </div>
        <div style={{ width: 140 }} />
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ── */}
        <section style={{ padding: '5rem 1.5rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 14vw, 10rem)', letterSpacing: '0.15em', lineHeight: 1, background: 'linear-gradient(180deg, #60a5fa 0%, #ffffff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 40px rgba(59,130,246,0.3))', marginBottom: '1rem' }}>
            DYNASTY
          </p>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem' }}>
            Season 2 Championship
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ width: 48, height: 1, background: `${ACCENT}60` }} />
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: ACCENT, letterSpacing: '0.15em' }}>
              Geico Bowl II Champions
            </p>
            <span style={{ width: 48, height: 1, background: `${ACCENT}60` }} />
          </div>
        </section>

        {/* ── Scoreboard ── */}
        <section style={{ maxWidth: 1000, margin: '0 auto 6rem', padding: '0 1.5rem' }}>
          <div style={{ position: 'relative', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', padding: '4rem 3rem', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 50%)', pointerEvents: 'none' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center' }}>

              {/* Duncanville */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ position: 'relative', width: 140, height: 140, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/dville-logo.png" alt="Duncanville" style={{ width: 96, height: 96, objectFit: 'contain' }} />
                  <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `2px solid ${ACCENT}40`, animation: 'spin 12s linear infinite' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.12em', color: '#fff' }}>DUNCANVILLE</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginTop: 4 }}>WINNER</div>
                </div>
              </div>

              {/* Score */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>FINAL SCORE</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 10vw, 8rem)', lineHeight: 1, color: '#fff', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.12))' }}>34</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: 'rgba(255,255,255,0.18)', marginBottom: 12 }}>:</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 10vw, 8rem)', lineHeight: 1, color: 'rgba(255,255,255,0.65)' }}>31</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.1rem', borderRadius: 999, border: `1px solid ${ACCENT}40`, background: `${ACCENT}12` }}>
                  <Trophy size={13} color={ACCENT} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>Bowl MVP: rolboxboy272248</span>
                </div>
              </div>

              {/* DeverX */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', opacity: 0.7 }}>
                <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'grayscale(20%)' }}>
                  <img src="/deverx-logo.png" alt="DeverX" style={{ width: 96, height: 96, objectFit: 'contain' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.12em', color: '#fff' }}>DEVERX</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>RUNNER UP</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Award Winners Strip ── */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)', padding: '4rem 1.5rem', marginBottom: '5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <Star size={28} color={ACCENT} />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.15em', color: '#fff', margin: 0 }}>AWARD WINNERS</h3>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2.5rem' }}>
              {AWARDS.map((award) => (
                <div key={award.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                    <div style={{ width: 88, height: 88, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', background: '#0a0a14', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={award.img}
                        alt={award.player}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER(award.player); }}
                      />
                    </div>
                    <div style={{ position: 'absolute', bottom: -8, right: -8, width: 30, height: 30, borderRadius: '50%', background: '#0a0a14', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                      <award.Icon size={14} color={award.color} />
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: 4 }}>{award.player}</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: award.color }}>{award.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Championship Roster ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '0.15em', color: '#fff', margin: '0 0 0.75rem' }}>
              CHAMPIONSHIP ROSTER
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', fontWeight: 600 }}>
              The Duncanville squad that claimed the Geico Bowl II title
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1.25rem' }}>
            {roster.players.map((player) => (
              <div key={player.name} className="dw-player-card-s2" style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', background: '#080810', border: '1px solid rgba(255,255,255,0.08)', cursor: 'default', transition: 'border-color .4s, transform .4s, box-shadow .4s' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '1rem' }}>
                  <img
                    src={player.headshot || PLACEHOLDER(player.name)}
                    alt={player.name}
                    style={{ width: '85%', height: '65%', objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.8))' }}
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER(player.name); }}
                  />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.7) 35%, transparent 65%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem 1rem' }}>
                  <div className="dw-bar-s2" style={{ width: 24, height: 2, background: ACCENT, marginBottom: '0.6rem', transition: 'width .4s' }} />
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.08em', color: '#fff', lineHeight: 1.1 }}>{player.name}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: `${ACCENT}70`, marginTop: 4 }}>S2</div>
                </div>
              </div>
            ))}
          </div>

          {roster.players.length < 11 && (
            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', letterSpacing: '0.05em' }}>
              * Partial roster — some members lost to history
            </p>
          )}
        </section>

      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .dw-player-card-s2:hover { border-color: rgba(59,130,246,0.45) !important; transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(59,130,246,0.12); }
        .dw-player-card-s2:hover .dw-bar-s2 { width: 48px !important; }
      `}</style>
    </div>
  );
}
