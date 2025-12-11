import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Award, TrendingUp, Clock, BookOpen } from 'lucide-react';

const Progress: React.FC = () => {
  const activityData = [
    { name: '04.12', val: 0 },
    { name: '05.12', val: 0 },
    { name: '06.12', val: 0 },
    { name: '07.12', val: 2 },
    { name: '08.12', val: 1 },
    { name: '09.12', val: 4 },
    { name: '10.12', val: 8 },
  ];

  const distributionData = [
    { name: 'Math', value: 40, color: '#8b5cf6' },
    { name: 'Eng', value: 30, color: '#d946ef' },
    { name: 'Ger', value: 20, color: '#06b6d4' },
    { name: 'Other', value: 10, color: '#94a3b8' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <TrendingUp className="text-fuchsia-500" />
          Dein Fortschritt
        </h2>
        <p className="text-slate-500 mt-2">Verfolge deine Lernreise mit detaillierten Analysen und KI-Insights.</p>
      </div>

      <div className="flex gap-4">
        <button className="px-4 py-2 bg-fuchsia-100 text-fuchsia-700 rounded-lg font-medium text-sm">Übersicht</button>
        <button className="px-4 py-2 bg-white text-slate-500 hover:bg-slate-50 rounded-lg font-medium text-sm">Analytik</button>
        <button className="px-4 py-2 bg-white text-slate-500 hover:bg-slate-50 rounded-lg font-medium text-sm">KI-Insights</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Gesamtpunkte" value="1,240" icon={<span className="text-xl">⚡️</span>} />
        <StatCard label="Gemeisterte Karten" value="342" icon={<TargetIcon />} />
        <StatCard label="Lernzeit" value="12h" icon={<Clock className="text-amber-500" size={20}/>} />
        <StatCard label="Erfolgsquote" value="92%" icon={<BookOpen className="text-blue-500" size={20}/>} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Aktivität der letzten 7 Tage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}}/>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Area type="monotone" dataKey="val" stroke="#d946ef" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-amber-500"/> Achievements
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-square rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-2xl grayscale hover:grayscale-0 transition-all cursor-pointer hover:bg-purple-50">
                  {i === 1 ? '🎯' : i === 2 ? '📚' : i === 3 ? '🔥' : '🔒'}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs font-medium text-blue-500 bg-blue-50 py-2 rounded-lg">
              0 von 6 Achievements freigeschaltet
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">🔥 Streak</h3>
            <div className="text-5xl font-bold text-orange-500 my-2">0</div>
            <p className="text-xs text-slate-400">Tage in Folge</p>
            <p className="text-xs text-slate-500 mt-2">Lerne jeden Tag, um deinen Streak zu halten!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-xl">
      {icon}
    </div>
    <div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
    </div>
  </div>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

export default Progress;