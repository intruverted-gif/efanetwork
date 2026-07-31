import React from 'react';
import { ChevronLeft, Trophy, Star, Shield, Zap, Target, Activity } from 'lucide-react';

const ROSTER = [
  { name: 'k4masi', role: 'QB / MVP', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-07580A7F9319D0393751027D8CCE97CD-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { name: 'silentfloat', role: 'WR', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C4E397C7F249A831F70F925E8EFB1860-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { name: 'talkdoesitall', role: 'DB', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-2E62F8731217C746A63DAA4819FDAD8E-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { name: '2kdrx', role: 'LB', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-B5B5241418BF0B55C9403DCDAB8FA073-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { name: 'WorldvsZai', role: 'RB', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C3898109DA64FC26780801E1E8AA9A42-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { name: 'mr_devy1122', role: 'WR', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-0C2F38FF9A7DF87D366F958990B43940-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { name: 'Koolaid_Man603', role: 'OL', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-3C4439AFA1B687C9F434023C787B6E67-Png/150/150/AvatarHeadshot/Png/noFilter' },
];

const AWARDS = [
  { title: 'Season MVP', player: 'k4masi', icon: Trophy, color: 'text-yellow-400', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-07580A7F9319D0393751027D8CCE97CD-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { title: 'QB of the Year', player: 'k4masi', icon: Star, color: 'text-amber-500', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-07580A7F9319D0393751027D8CCE97CD-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { title: 'RB of the Year', player: 'WorldvsZai', icon: Zap, color: 'text-blue-400', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C3898109DA64FC26780801E1E8AA9A42-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { title: 'WR of the Year', player: 'mr_devy1122', icon: Target, color: 'text-red-400', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-0C2F38FF9A7DF87D366F958990B43940-Png/150/150/AvatarHeadshot/Png/noFilter' },
  { title: 'TE of the Year', player: 'Coltons12_20', icon: Activity, color: 'text-orange-400', img: null },
  { title: 'OL of the Year', player: 'Koolaid_Man603', icon: Shield, color: 'text-emerald-400', img: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-3C4439AFA1B687C9F434023C787B6E67-Png/150/150/AvatarHeadshot/Png/noFilter' },
];

export default function DynastyWall() {
  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans overflow-x-hidden selection:bg-amber-500/30">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .glow-gold { filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.3)); }
        .score-glow { filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.15)); }
        .radial-bg { background: radial-gradient(circle at 50% 30%, rgba(45, 27, 0, 0.8) 0%, rgba(5, 5, 8, 1) 70%); }
        .noise {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 50;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
        }
      `}} />
      <div className="noise"></div>

      {/* Navigation & Tabs */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 border-b border-white/5">
        <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase tracking-wider text-sm font-medium">
          <ChevronLeft className="w-4 h-4" />
          Back to Standings
        </button>
        <div className="flex gap-8 border-b border-white/10">
          <button className="px-4 py-2 font-bebas text-2xl tracking-widest text-amber-500 border-b-2 border-amber-500">
            SEASON 1
          </button>
          <button className="px-4 py-2 font-bebas text-2xl tracking-widest text-white/20 hover:text-white/50 transition-colors border-b-2 border-transparent">
            SEASON 2
          </button>
        </div>
        <div className="w-[140px]"></div> {/* Spacer for center alignment */}
      </nav>

      <main className="relative z-10 w-full radial-bg min-h-screen pb-32">
        {/* Header section */}
        <section className="pt-24 pb-16 flex flex-col items-center text-center px-4">
          <p className="font-bebas text-7xl md:text-9xl tracking-[0.15em] bg-gradient-to-b from-amber-400 to-white text-transparent bg-clip-text mb-4 glow-gold">
            DYNASTY
          </p>
          <div className="flex flex-col items-center gap-2">
            <h2 className="uppercase tracking-[0.3em] text-white/60 text-sm md:text-base font-bold">
              Season 1 Championship
            </h2>
            <div className="flex items-center gap-3">
              <span className="w-12 h-[1px] bg-amber-500/50"></span>
              <p className="font-bebas text-2xl md:text-3xl text-amber-500 tracking-wider">
                Geico Bowl I Champions
              </p>
              <span className="w-12 h-[1px] bg-amber-500/50"></span>
            </div>
          </div>
        </section>

        {/* Scoreboard Section */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <div className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden py-16 px-8 score-glow shadow-2xl shadow-black/80">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
              
              {/* Don Bosco */}
              <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
                <div className="w-32 h-32 md:w-48 md:h-48 relative flex items-center justify-center bg-black/50 rounded-full border border-white/10 shadow-lg">
                  <img src="/__mockup/images/db-logo.png" alt="Don Bosco Logo" className="w-24 h-24 md:w-36 md:h-36 object-contain" />
                  <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-[spin_10s_linear_infinite]"></div>
                </div>
                <div className="text-center">
                  <h3 className="font-bebas text-4xl md:text-5xl tracking-widest text-white">DON BOSCO</h3>
                  <p className="uppercase tracking-[0.2em] text-amber-500 text-sm font-bold mt-1">WINNER</p>
                </div>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center justify-center w-full md:w-1/3 relative z-10">
                <p className="uppercase tracking-widest text-white/40 font-bold mb-4">FINAL SCORE</p>
                <div className="flex items-center justify-center gap-6 md:gap-12">
                  <span className="font-bebas text-8xl md:text-[10rem] leading-none text-white glow-gold">23</span>
                  <span className="font-bebas text-5xl md:text-7xl text-white/20 mb-4">:</span>
                  <span className="font-bebas text-8xl md:text-[10rem] leading-none text-white/80">22</span>
                </div>
                <div className="mt-8 px-6 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-500 text-sm font-bold tracking-widest uppercase">Bowl MVP: k4masi</span>
                </div>
              </div>

              {/* Bob Jones */}
              <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
                <div className="w-32 h-32 md:w-48 md:h-48 relative flex items-center justify-center bg-black/50 rounded-full border border-white/10 shadow-lg opacity-80 grayscale-[20%]">
                  <img src="/__mockup/images/bj-logo.png" alt="Bob Jones Logo" className="w-24 h-24 md:w-36 md:h-36 object-contain" />
                </div>
                <div className="text-center opacity-80">
                  <h3 className="font-bebas text-4xl md:text-5xl tracking-widest text-white">BOB JONES</h3>
                  <p className="uppercase tracking-[0.2em] text-white/40 text-sm font-bold mt-1">RUNNER UP</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Award Winners Strip */}
        <section className="w-full mb-32 border-y border-white/5 bg-black/20 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="font-bebas text-4xl tracking-widest text-white mb-10 text-center md:text-left flex items-center gap-4">
              <Star className="w-8 h-8 text-amber-500" />
              AWARD WINNERS
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent hidden md:block"></div>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {AWARDS.map((award, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${award.color.replace('text-', 'bg-')}`}></div>
                    <div className={`w-24 h-24 rounded-full border-2 border-white/10 group-hover:border-white/30 bg-[#0a0a0f] overflow-hidden flex items-center justify-center relative z-10 transition-colors duration-300`}>
                      {award.img ? (
                        <img src={award.img} alt={award.player} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <span className="font-bebas text-3xl text-white/30">{award.player.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center z-20 shadow-xl">
                      <award.icon className={`w-5 h-5 ${award.color}`} />
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-lg">{award.player}</h4>
                  <p className={`text-sm uppercase tracking-wider mt-1 ${award.color} font-medium text-center`}>{award.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Championship Roster */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16 text-center">
            <h3 className="font-bebas text-5xl md:text-6xl tracking-widest text-white mb-4">
              CHAMPIONSHIP ROSTER
            </h3>
            <p className="text-white/50 uppercase tracking-[0.2em] max-w-2xl">
              The immortal squad that secured the inaugural Geico Bowl victory for Don Bosco.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ROSTER.map((player, i) => (
              <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0a0a0f] border border-white/10 transition-all duration-500 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20"></div>
                
                {/* Player Number Watermark */}
                <div className="absolute -right-4 -top-4 font-bebas text-[12rem] leading-none text-white/[0.03] z-0 select-none group-hover:text-amber-500/[0.05] transition-colors duration-500">
                  {Math.floor(Math.random() * 99) + 1}
                </div>

                <div className="absolute inset-x-0 top-0 h-2/3 flex items-end justify-center z-0 pt-8 pb-4">
                  <img src={player.img} alt={player.name} className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out" />
                </div>
                
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end">
                  <div className="w-8 h-[2px] bg-amber-500 mb-4 group-hover:w-16 transition-all duration-500"></div>
                  <h4 className="font-bebas text-3xl tracking-wide text-white leading-none mb-2 group-hover:text-amber-400 transition-colors">
                    {player.name}
                  </h4>
                  <p className="uppercase tracking-[0.2em] text-white/50 text-sm font-bold flex items-center justify-between">
                    <span>{player.role}</span>
                    <span className="text-amber-500/40">S1</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
