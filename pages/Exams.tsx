import React from 'react';
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import { Exam } from '../types';

interface ExamsProps {
  exams: Exam[];
  onOpenExam: (exam: Exam) => void;
}

const Exams: React.FC<ExamsProps> = ({ exams, onOpenExam }) => {
  // Group exams by subject
  const examsBySubject = exams.reduce((acc, exam) => {
    if (!acc[exam.subject]) {
      acc[exam.subject] = [];
    }
    acc[exam.subject].push(exam);
    return acc;
  }, {} as Record<string, Exam[]>);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-fuchsia-600">Prüfungsvorbereitung</h2>
          <p className="text-slate-500 mt-1">Verwalte deine Fächer und anstehenden Prüfungen.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Fach hinzufügen</button>
          <button className="px-4 py-2 bg-fuchsia-500 text-white rounded-lg text-sm font-medium hover:bg-fuchsia-600 flex items-center gap-2">
            <Plus size={16}/> Prüfung erstellen
          </button>
        </div>
      </div>

      {/* Exam List Groups */}
      {Object.keys(examsBySubject).length === 0 ? (
         <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
           <h3 className="text-lg font-bold text-slate-400">Keine Prüfungen gefunden</h3>
         </div>
      ) : (
        Object.entries(examsBySubject).map(([subject, subjectExams]: [string, Exam[]]) => (
          <div key={subject} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{subject}</h3>
              <span className="text-xs font-semibold bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">{subjectExams.length} Prüfungen</span>
            </div>
            <div className="divide-y divide-slate-50">
              {subjectExams.map(exam => (
                <div 
                  key={exam.id} 
                  onClick={() => onOpenExam(exam)}
                  className="p-4 flex items-center justify-between hover:bg-fuchsia-50/10 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <Calendar size={18}/>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{exam.title}</h4>
                      <p className="text-xs text-slate-400">{new Date(exam.date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${exam.status === 'passed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                      {exam.status === 'passed' ? 'Vergangen' : 'Lernbereit'}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-fuchsia-500 hover:bg-fuchsia-50 rounded-lg transition-colors">
                        <Edit2 size={16}/>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Exams;