import React from 'react';
import { 
  Home, 
  Trophy, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Brain, 
  PlusCircle, 
  Settings, 
  Search,
  Book
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const user: UserProfile = {
    name: "Sabir Rastoder...",
    email: "sr@expertico.ch",
    role: "Student",
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'erfolge', label: 'Erfolge', icon: Trophy },
    { id: 'fortschritt', label: 'Fortschritt', icon: TrendingUp },
    { id: 'lerngruppen', label: 'Lerngruppen', icon: Users },
    { id: 'pruefungen', label: 'Prüfungen', icon: GraduationCap },
    { id: 'review', label: 'Prüfungs Review', icon: Book }, // Using Book as generic icon
    { id: 'bibliothek', label: 'Bibliothek', icon: BookOpen },
    { id: 'wissen', label: 'Wissen', icon: Brain },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* Brand */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            M
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600">
            MindVibe
          </h1>
        </div>
        <p className="text-xs text-slate-400 pl-10">Für Rayan & Sarina</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Sets suchen..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 text-slate-600 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-md shadow-pink-200' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}

        <button 
          onClick={() => onNavigate('create')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 mt-4"
        >
          <PlusCircle size={18} className="text-slate-400" />
          <span className="font-medium">Erstellen</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center font-bold text-sm">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
          <Settings size={16} className="text-slate-400" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
