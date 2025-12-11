import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Play, Pause, RotateCcw, Brain, Coffee, CheckCircle2 } from 'lucide-react';
import { Exam } from '../types';
import StudyContentRenderer from '../components/StudyContentRenderer';

interface LearningSessionProps {
  exam: Exam;
  onBack: () => void;
}

const LearningSession: React.FC<LearningSessionProps> = ({ exam, onBack }) => {
  const FOCUS_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60; // 5 minutes

  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      if (!isBreak) {
        // Focus session done
        setCompletedSessions((prev) => prev + 1);
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
      } else {
        // Break session done
        setIsBreak(false);
        setTimeLeft(FOCUS_TIME);
      }
      // Play notification sound (optional)
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(FOCUS_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const healthTips = [
    "Trink ein Glas Wasser für bessere Konzentration.",
    "Mach kreisende Bewegungen mit deinen Schultern.",
    "Schau für 20 Sekunden in die Ferne (20-20-20 Regel).",
    "Streck dich und atme tief ein.",
    "Steh kurz auf und geh ein paar Schritte."
  ];

  const currentTip = healthTips[Math.floor(Math.random() * healthTips.length)];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">{exam.title}</h2>
            <p className="text-xs text-slate-500">{exam.subject} • {isBreak ? 'Pause' : 'Fokuszeit'}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           {/* Pomodoro Timer Display */}
           <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${isBreak ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-700'}`}>
              {isBreak ? <Coffee size={18} /> : <Clock size={18} />}
              <span className="font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
              <div className="flex gap-1 ml-2">
                <button onClick={toggleTimer} className="p-1 hover:bg-black/5 rounded">
                  {isActive ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button onClick={resetTimer} className="p-1 hover:bg-black/5 rounded">
                  <RotateCcw size={16} />
                </button>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
           {isBreak ? (
             <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
               <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
                 <Coffee size={48} />
               </div>
               <h3 className="text-2xl font-bold text-slate-800 mb-2">Zeit für eine Pause!</h3>
               <p className="text-slate-500 max-w-md mb-8">Du hast 25 Minuten fokussiert gelernt. Gönn deinem Gehirn eine kurze Auszeit.</p>
               
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 max-w-sm w-full">
                 <h4 className="font-bold text-emerald-700 mb-2 flex items-center gap-2">
                   <Brain size={18}/> Health Tip
                 </h4>
                 <p className="text-slate-600 italic">"{currentTip}"</p>
               </div>

               <button 
                 onClick={() => { setIsBreak(false); setTimeLeft(FOCUS_TIME); }}
                 className="mt-8 text-slate-400 hover:text-slate-600 text-sm font-medium"
               >
                 Pause überspringen
               </button>
             </div>
           ) : (
             <StudyContentRenderer content={exam.content || "Keine Inhalte verfügbar."} />
           )}
        </div>

        {/* Sidebar Info (Desktop) */}
        <div className="hidden md:block w-72 bg-white border-l border-slate-100 p-6 overflow-y-auto">
          <h3 className="font-bold text-slate-800 mb-4">Session Stats</h3>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="text-xs text-slate-400 mb-1">Abgeschlossene Pomodoros</div>
              <div className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {completedSessions} <span className="text-base font-normal">🍅</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
               <div className="text-xs text-slate-400 mb-1">Fokuszeit heute</div>
               <div className="text-xl font-bold text-slate-800">
                 {Math.floor(completedSessions * 25)} Min.
               </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-bold text-slate-800 text-sm mb-3">Tastaturkürzel</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex justify-between"><span>Timer Start/Stop</span> <kbd className="bg-slate-100 px-1.5 rounded border border-slate-200">Space</kbd></li>
              <li className="flex justify-between"><span>Karte drehen</span> <kbd className="bg-slate-100 px-1.5 rounded border border-slate-200">Click</kbd></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningSession;