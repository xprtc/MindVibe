import React from 'react';
import { Target, Calendar, Award, Plus, FolderPlus, Clock, CheckCircle2 } from 'lucide-react';
import { Subject, Exam, Goal } from '../types';

interface DashboardProps {
  onNavigate: (page: string) => void;
  exams: Exam[];
  onOpenExam: (exam: Exam) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, exams, onOpenExam }) => {
  const goals: Goal[] = [
    {
      id: '1',
      type: 'short',
      title: '4. Semester',
      description: 'Ziel-Schnitt',
      metric: { label: 'Aktuell', value: 4.8, target: 5.0 },
      icon: 'target'
    },
    {
      id: '2',
      type: 'mid',
      title: '5. Semester',
      description: 'Fokus auf Notenstabilisierung für den nächsten Abschnitt.',
      metric: { label: 'Ziel', value: 'Ø 5.0' },
      icon: 'calendar'
    },
    {
      id: '3',
      type: 'long',
      title: 'BSc AI in Software Engineering',
      description: 'Der Weg ist das Ziel. Bleib dran!',
      icon: 'award'
    }
  ];

  const subjects: Subject[] = [
    { id: '1', name: 'Deutsch', targetGrade: 5, currentGrade: 4.2, color: 'bg-indigo-500' },
    { id: '2', name: 'Englisch', targetGrade: 5, currentGrade: 5.3, color: 'bg-blue-500' },
    { id: '3', name: 'Französisch', targetGrade: 5, currentGrade: 4.0, color: 'bg-blue-600' },
    { id: '4', name: 'Mathematik', targetGrade: 5, currentGrade: 4.8, color: 'bg-indigo-600' },
    { id: '5', name: 'Informatik', targetGrade: 5, currentGrade: 5.5, color: 'bg-purple-600' },
  ];

  // Sort exams by date (nearest first)
  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-fuchsia-400 to-purple-600 p-8 text-white shadow-xl shadow-purple-200">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <span className="text-xl">✨</span>
              <span className="font-medium">Guten Abend, Sabir!</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Bereit für eine neue Lernrunde?</h2>
            <p className="opacity-90 max-w-xl">Bleib an deinen Zielen für dieses Semester dran! Du hast diese Woche bereits 3 Lerneinheiten gemeistert.</p>
          </div>
          <button 
            onClick={() => onNavigate('create')}
            className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg"
          >
            <Plus size={20} />
            Neue Prüfung
          </button>
        </div>
        
        {/* Decorative Background Circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-fuchsia-300 opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal, idx) => (
          <div key={goal.id} className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow ${idx === 2 ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${idx === 2 ? 'text-indigo-200' : 'text-blue-600'}`}>
                {goal.type === 'short' ? 'Kurzfristig (Aug - Dez)' : goal.type === 'mid' ? 'Mittelfristig (Jan - Jun)' : 'Langfristig'}
              </span>
              {goal.icon === 'target' && <Target className={idx === 2 ? 'text-white' : 'text-blue-500'} size={20} />}
              {goal.icon === 'calendar' && <Calendar className={idx === 2 ? 'text-white' : 'text-purple-500'} size={20} />}
              {goal.icon === 'award' && <GraduationCap className={idx === 2 ? 'text-white' : 'text-white'} size={20} />}
            </div>
            
            <h3 className="text-lg font-bold mb-2">{goal.title}</h3>
            <p className={`text-sm mb-6 ${idx === 2 ? 'text-indigo-100' : 'text-slate-500'}`}>{goal.description}</p>
            
            {goal.metric && goal.metric.target ? (
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <div className="text-xs text-slate-400 mb-1">{goal.description}</div>
                  <div className="text-2xl font-bold">{goal.metric.target}.0</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-1">{goal.metric.label}</div>
                  <div className={`text-2xl font-bold ${Number(goal.metric.value) < Number(goal.metric.target) ? 'text-amber-500' : 'text-emerald-500'}`}>{goal.metric.value}</div>
                </div>
              </div>
            ) : idx !== 2 ? (
               <div className="mt-auto inline-block bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-md">
                 {goal.metric?.label}: {goal.metric?.value}
               </div>
            ) : null}
            
            {/* Background Icon for Long Term */}
            {idx === 2 && <GraduationCap className="absolute -bottom-4 -right-4 text-white opacity-10" size={120} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Actions & Subjects */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Schnellaktionen</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate('create')}
                className="flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-slate-200 hover:border-fuchsia-300 hover:bg-fuchsia-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={20} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-slate-700">Neue Prüfung</div>
                  <div className="text-xs text-slate-400">Plane & generiere</div>
                </div>
              </button>
              
              <button className="flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FolderPlus size={20} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-slate-700">Ordner erstellen</div>
                  <div className="text-xs text-slate-400">Organisiere</div>
                </div>
              </button>
            </div>
          </div>

          {/* Subjects Progress */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Fächer & Ziele</h3>
              <button className="text-xs font-medium text-slate-400 hover:text-purple-600">Alle ansehen</button>
            </div>
            
            <div className="space-y-5">
              {subjects.map(subject => (
                <div key={subject.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${subject.color}`}></span>
                      <span className="font-medium text-slate-700">{subject.name}</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-slate-400">Ziel: {subject.targetGrade}</span>
                      <span className={`font-bold ${subject.currentGrade >= subject.targetGrade ? 'text-emerald-500' : 'text-amber-500'}`}>{subject.currentGrade}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${subject.color}`} 
                      style={{ width: `${(subject.currentGrade / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              
              <button className="w-full mt-4 py-2 border border-dashed border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2">
                <Plus size={14} /> Fach hinzufügen
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Exam Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Meine Tests (Prüfungen)</h3>
              <button 
                onClick={() => onNavigate('pruefungen')}
                className="text-xs font-medium text-slate-400 hover:text-purple-600"
              >
                Alle anzeigen
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
              {sortedExams.map((exam) => {
                const examDate = new Date(exam.date);
                const day = examDate.getDate();
                const month = examDate.toLocaleString('de-DE', { month: 'short' }).toUpperCase();
                const isPassed = exam.status === 'passed';

                return (
                  <div 
                    key={exam.id} 
                    onClick={() => onOpenExam(exam)}
                    className="group flex items-center p-4 rounded-xl border border-slate-50 hover:border-purple-200 hover:bg-purple-50 hover:shadow-md transition-all cursor-pointer"
                  >
                    {/* Date Box */}
                    <div className="flex-shrink-0 w-14 h-14 bg-white border border-slate-100 rounded-xl flex flex-col items-center justify-center mr-4 group-hover:border-purple-200 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{month}</span>
                      <span className="text-xl font-bold text-slate-800">{day}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate group-hover:text-purple-700 transition-colors">{exam.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                           {isPassed ? <Clock size={12} className="text-slate-400"/> : <Clock size={12} className="text-purple-500"/>}
                           {isPassed ? 'Vergangen' : 'Anstehend'}
                        </span>
                        {exam.status === 'ready' && (
                          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} /> Inhalte bereit
                          </span>
                        )}
                        <span className="text-slate-400">• {exam.subject}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-slate-300 group-hover:text-purple-500 transition-colors transform group-hover:translate-x-1 duration-200">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                );
              })}
              
              {exams.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <p>Keine Prüfungen gefunden.</p>
                  <button onClick={() => onNavigate('create')} className="text-fuchsia-500 font-medium text-sm mt-2 hover:underline">Erstelle die erste!</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

function GraduationCap(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )
}