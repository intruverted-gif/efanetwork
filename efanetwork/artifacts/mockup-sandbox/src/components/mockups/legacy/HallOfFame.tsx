import React from 'react';
import { ArrowLeft, Trophy, Crown, Zap, Target, Shield, Link as LinkIcon, Star } from 'lucide-react';

const roster = [
  { name: "k4masi", image: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-07580A7F9319D0393751027D8CCE97CD-Png/150/150/AvatarHeadshot/Png/noFilter" },
  { name: "silentfloat", image: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C4E397C7F249A831F70F925E8EFB1860-Png/150/150/AvatarHeadshot/Png/noFilter" },
  { name: "talkdoesitall", image: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-2E62F8731217C746A63DAA4819FDAD8E-Png/150/150/AvatarHeadshot/Png/noFilter" },
  { name: "2kdrx", image: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-B5B5241418BF0B55C9403DCDAB8FA073-Png/150/150/AvatarHeadshot/Png/noFilter" },
  { name: "WorldvsZai", image: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C3898109DA64FC26780801E1E8AA9A42-Png/150/150/AvatarHeadshot/Png/noFilter" },
  { name: "mr_devy1122", image: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-0C2F38FF9A7DF87D366F958990B43940-Png/150/150/AvatarHeadshot/Png/noFilter" },
  { name: "Koolaid_Man603", image: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-3C4439AFA1B687C9F434023C787B6E67-Png/150/150/AvatarHeadshot/Png/noFilter" }
];

const awards = [
  { title: "Season MVP", name: "k4masi", icon: Crown, color: "gold" },
  { title: "QB of the Year", name: "k4masi", icon: Target, color: "silver" },
  { title: "RB of the Year", name: "WorldvsZai", icon: Zap, color: "silver" },
  { title: "WR of the Year", name: "mr_devy1122", icon: Star, color: "silver" },
  { title: "TE of the Year", name: "Coltons12_20", icon: LinkIcon, color: "silver" },
  { title: "OL of the Year", name: "Koolaid_Man603", icon: Shield, color: "silver" }
];

export default function HallOfFame() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-neutral-300 font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Background ambient light */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Nav */}
        <div className="mb-16">
          <button className="flex items-center gap-2 text-neutral-500 hover:text-[#d4af37] transition-colors text-sm uppercase tracking-widest font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Standings
          </button>
        </div>

        {/* Header */}
        <header className="mb-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#f5d04a] text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
            Hall of Fame
            <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-['Playfair_Display',serif] font-black tracking-tight mb-12 bg-gradient-to-b from-[#f5d04a] via-[#d4af37] to-[#8a7322] text-transparent bg-clip-text drop-shadow-[0_0_40px_rgba(212,175,55,0.2)]">
            EFA LEGACY
          </h1>
          
          {/* Season Tabs */}
          <div className="flex items-center gap-4 bg-[#12121a]/80 p-2 rounded-full border border-white/5 backdrop-blur-md shadow-2xl">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#e6c153] to-[#b3932d] text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] text-sm uppercase tracking-widest transition-all">
              Season 1
            </button>
            <button className="px-8 py-3 rounded-full hover:bg-white/5 text-neutral-500 hover:text-neutral-300 font-bold text-sm uppercase tracking-widest transition-all">
              Season 2
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Championship & Roster */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Championship Card */}
            <section className="relative group overflow-hidden rounded-3xl bg-gradient-to-b from-[#15151e] to-[#0d0d14] border border-[#d4af37]/20 transition-all duration-700 hover:border-[#d4af37]/60 shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(212,175,55,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="p-8 md:p-14">
                <div className="flex flex-col items-center justify-center text-center mb-12">
                  <span className="text-[#d4af37] font-semibold tracking-[0.3em] text-sm uppercase mb-4 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#d4af37]/50"></span>
                    Geico Bowl I Champions
                    <span className="h-px w-8 bg-[#d4af37]/50"></span>
                  </span>
                  <h2 className="text-4xl md:text-6xl font-['Playfair_Display',serif] font-bold text-white tracking-wide">Don Bosco</h2>
                </div>

                <div className="flex items-center justify-center gap-8 md:gap-20">
                  {/* Team 1 */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-black/50 border-2 border-[#d4af37]/30 p-6 flex items-center justify-center relative shadow-[0_0_40px_rgba(212,175,55,0.2)] group-hover:border-[#d4af37]/80 group-hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] transition-all duration-700">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#d4af37]/20 to-transparent blur-2xl"></div>
                      <img src="/__mockup/images/db-logo.png" alt="Don Bosco" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                    </div>
                    <span className="text-xl md:text-3xl font-black text-white tracking-widest">DON</span>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center">
                    <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f0f0f0] to-[#888] tracking-tighter drop-shadow-lg">
                      23 <span className="text-neutral-700 font-light mx-2">-</span> 22
                    </div>
                    <span className="mt-4 text-neutral-500 font-bold tracking-[0.4em] text-sm uppercase">Final</span>
                  </div>

                  {/* Team 2 */}
                  <div className="flex flex-col items-center gap-6 opacity-50 hover:opacity-80 transition-opacity duration-500 grayscale hover:grayscale-0">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-black/50 border-2 border-white/10 p-6 flex items-center justify-center relative">
                      <img src="/__mockup/images/bj-logo.png" alt="Bob Jones" className="w-full h-full object-contain relative z-10" />
                    </div>
                    <span className="text-xl md:text-3xl font-black text-neutral-400 tracking-widest">BJ</span>
                  </div>
                </div>

              </div>
              
              {/* Gold Bottom Accent */}
              <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
            </section>

            {/* Championship Roster */}
            <section className="space-y-8 bg-[#111118] border border-white/5 p-8 rounded-3xl">
              <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                  <h3 className="text-3xl font-['Playfair_Display',serif] font-bold text-white mb-2">Championship Roster</h3>
                  <p className="text-neutral-500 text-sm">The legends who brought it home.</p>
                </div>
                <span className="text-[#d4af37] text-sm font-bold tracking-[0.2em] uppercase bg-[#d4af37]/10 px-4 py-1.5 rounded-full border border-[#d4af37]/20">Don Bosco</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {roster.map(player => (
                  <div key={player.name} className="group relative rounded-2xl bg-[#0a0a0f] border border-white/5 p-6 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#d4af37]/50 hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="w-24 h-24 rounded-full border-2 border-white/10 mb-5 overflow-hidden group-hover:border-[#d4af37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 relative z-10 bg-black">
                      <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <span className="text-white font-bold relative z-10 text-base group-hover:text-[#f5d04a] transition-colors">{player.name}</span>
                    <span className="text-neutral-500 text-xs mt-1.5 uppercase tracking-wider font-semibold relative z-10 group-hover:text-[#d4af37]/70">Champion</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Awards & MVP */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Bowl MVP */}
            <section className="relative rounded-3xl bg-gradient-to-b from-[#1f1905] to-[#0a0a0f] border border-[#d4af37]/40 p-10 text-center overflow-hidden group shadow-[0_0_40px_rgba(212,175,55,0.1)] hover:shadow-[0_0_60px_rgba(212,175,55,0.2)] transition-shadow duration-700">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2),transparent_70%)]"></div>
              
              <h3 className="text-[#d4af37] font-bold tracking-[0.3em] text-sm uppercase mb-10 relative z-10 flex items-center justify-center gap-3">
                <Crown className="w-5 h-5" />
                Bowl MVP
              </h3>

              <div className="relative inline-block mb-8 z-10">
                <div className="absolute inset-0 bg-[#d4af37] rounded-full blur-2xl opacity-50 group-hover:opacity-80 group-hover:scale-125 transition-all duration-700"></div>
                <div className="absolute -inset-4 rounded-full border-2 border-[#d4af37]/30 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute -inset-8 rounded-full border border-[#d4af37]/20 border-dashed animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="w-40 h-40 rounded-full border-4 border-[#d4af37] relative bg-black overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.6)] group-hover:border-[#f5d04a] transition-colors duration-500">
                  <img src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-07580A7F9319D0393751027D8CCE97CD-Png/150/150/AvatarHeadshot/Png/noFilter" alt="k4masi" className="w-full h-full object-cover" />
                </div>
              </div>

              <h4 className="text-4xl font-['Playfair_Display',serif] font-bold text-white mb-3 relative z-10 group-hover:text-[#f5d04a] transition-colors">k4masi</h4>
              <p className="text-[#d4af37]/80 text-sm uppercase tracking-[0.2em] font-semibold relative z-10">Geico Bowl I</p>
            </section>

            {/* Individual Awards */}
            <section className="rounded-3xl bg-[#111118] border border-white/5 overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 bg-gradient-to-b from-black/40 to-transparent">
                <h3 className="text-2xl font-['Playfair_Display',serif] font-bold text-white flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-[#d4af37]" />
                  Season Awards
                </h3>
              </div>
              
              <div className="divide-y divide-white/5">
                {awards.map((award, i) => (
                  <div key={i} className="p-5 flex items-center justify-between group hover:bg-white/[0.03] transition-colors cursor-default relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#0a0a0f] border-2 shadow-lg ${award.color === 'gold' ? 'border-[#d4af37]/50 text-[#d4af37] group-hover:border-[#d4af37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-white/10 text-white/50 group-hover:text-white/90 group-hover:border-white/30'} transition-all duration-300`}>
                        <award.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-white text-base font-bold group-hover:text-[#f5d04a] transition-colors">{award.name}</div>
                        <div className={`text-xs font-semibold tracking-wide uppercase mt-1 ${award.color === 'gold' ? 'text-[#d4af37]' : 'text-neutral-500 group-hover:text-neutral-400'}`}>{award.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
