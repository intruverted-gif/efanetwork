import React from 'react';
import { Trophy, Award, ChevronLeft } from 'lucide-react';

export default function Chronicle() {
  const championship = {
    winner: 'Don Bosco',
    winnerLogo: '/__mockup/images/db-logo.png',
    loser: 'Bob Jones',
    loserLogo: '/__mockup/images/bj-logo.png',
    winnerScore: 23,
    loserScore: 22,
    bowlName: 'Geico Bowl I',
    mvp: 'k4masi'
  };

  const roster = [
    { name: 'k4masi', headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-07580A7F9319D0393751027D8CCE97CD-Png/150/150/AvatarHeadshot/Png/noFilter' },
    { name: 'silentfloat', headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C4E397C7F249A831F70F925E8EFB1860-Png/150/150/AvatarHeadshot/Png/noFilter' },
    { name: 'talkdoesitall', headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-2E62F8731217C746A63DAA4819FDAD8E-Png/150/150/AvatarHeadshot/Png/noFilter' },
    { name: '2kdrx', headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-B5B5241418BF0B55C9403DCDAB8FA073-Png/150/150/AvatarHeadshot/Png/noFilter' },
    { name: 'WorldvsZai', headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C3898109DA64FC26780801E1E8AA9A42-Png/150/150/AvatarHeadshot/Png/noFilter' },
    { name: 'mr_devy1122', headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-0C2F38FF9A7DF87D366F958990B43940-Png/150/150/AvatarHeadshot/Png/noFilter' },
    { name: 'Koolaid_Man603', headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-3C4439AFA1B687C9F434023C787B6E67-Png/150/150/AvatarHeadshot/Png/noFilter' }
  ];

  const awards = [
    { emoji: '👑', title: 'Season MVP', winner: 'k4masi' },
    { emoji: '🏈', title: 'QB of the Year', winner: 'k4masi' },
    { emoji: '⚡', title: 'RB of the Year', winner: 'WorldvsZai' },
    { emoji: '🎯', title: 'WR of the Year', winner: 'mr_devy1122' },
    { emoji: '🔗', title: 'TE of the Year', winner: 'Coltons12_20' },
    { emoji: '🛡️', title: 'OL of the Year', winner: 'Koolaid_Man603' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <div className="border-b-4 border-slate-900 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Standings</span>
          </button>
        </div>
      </div>

      {/* Season Tabs */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button className="px-8 py-4 bg-slate-900 text-white font-black tracking-wider text-lg border-b-4 border-red-600">
              SEASON 1
            </button>
            <button className="px-8 py-4 bg-slate-100 text-slate-500 font-black tracking-wider text-lg hover:bg-slate-200 transition-colors">
              SEASON 2
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="font-black text-7xl md:text-8xl tracking-tighter leading-none text-slate-900 mb-2">
            CHAMPIONS
          </h1>
          <h1 className="font-black text-7xl md:text-8xl tracking-tighter leading-none text-slate-900 mb-4">
            & AWARDS
          </h1>
          <div className="h-2 w-32 bg-red-600"></div>
        </div>

        {/* Championship Game */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <Trophy className="w-8 h-8 text-red-600" />
            <h2 className="font-black text-4xl tracking-wider text-slate-900">
              {championship.bowlName.toUpperCase()}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-900">
            {/* Scoreboard */}
            <div className="grid grid-cols-2 divide-x-4 divide-slate-900">
              {/* Winner Side */}
              <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 relative">
                <div className="absolute top-4 right-4">
                  <div className="bg-green-600 text-white px-4 py-1.5 rounded-full font-black text-sm tracking-wider shadow-lg">
                    CHAMPIONS
                  </div>
                </div>
                <div className="flex items-center gap-6 mb-6">
                  <img 
                    src={championship.winnerLogo} 
                    alt={championship.winner}
                    className="w-24 h-24 object-contain"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-600 tracking-wider mb-1">WINNER</div>
                    <div className="font-black text-4xl tracking-tight text-slate-900">
                      {championship.winner}
                    </div>
                  </div>
                </div>
                <div className="font-black text-8xl text-green-600 leading-none">
                  {championship.winnerScore}
                </div>
              </div>

              {/* Loser Side */}
              <div className="p-8 bg-slate-50 relative">
                <div className="flex items-center gap-6 mb-6">
                  <img 
                    src={championship.loserLogo} 
                    alt={championship.loser}
                    className="w-24 h-24 object-contain"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-500 tracking-wider mb-1">RUNNER-UP</div>
                    <div className="font-black text-4xl tracking-tight text-slate-700">
                      {championship.loser}
                    </div>
                  </div>
                </div>
                <div className="font-black text-8xl text-slate-400 leading-none">
                  {championship.loserScore}
                </div>
              </div>
            </div>

            {/* Bowl MVP */}
            <div className="bg-slate-900 text-white px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-400" />
                <span className="font-black text-lg tracking-wider">BOWL MVP</span>
              </div>
              <span className="font-black text-2xl tracking-tight">{championship.mvp}</span>
            </div>
          </div>
        </section>

        {/* Individual Awards */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <Award className="w-8 h-8 text-red-600" />
            <h2 className="font-black text-4xl tracking-wider text-slate-900">
              INDIVIDUAL AWARDS
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {awards.map((award, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl shadow-lg border-2 border-slate-900 p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center gap-5">
                  <div className="text-6xl flex-shrink-0">
                    {award.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-500 tracking-wider mb-1">
                      {award.title.toUpperCase()}
                    </div>
                    <div className="font-black text-3xl tracking-tight text-slate-900">
                      {award.winner}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Championship Roster */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-red-600 rounded"></div>
            <h2 className="font-black text-4xl tracking-wider text-slate-900">
              CHAMPIONSHIP ROSTER
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-4 border-slate-900 p-8">
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={championship.winnerLogo} 
                alt={championship.winner}
                className="w-16 h-16 object-contain"
              />
              <div className="font-black text-3xl tracking-tight text-slate-900">
                {championship.winner}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {roster.map((player, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-900 mb-3 bg-slate-100">
                    <img 
                      src={player.headshot} 
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-bold text-sm text-slate-900 break-words w-full">
                    {player.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Decoration */}
        <div className="mt-20 flex justify-center">
          <div className="h-1 w-64 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
