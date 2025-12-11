import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateWizard from './pages/CreateWizard';
import Progress from './pages/Progress';
import Exams from './pages/Exams';
import LearningSession from './pages/LearningSession';
import { Exam } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeExam, setActiveExam] = useState<Exam | null>(null);

  // Global State for Exams (Mock Data + User Created)
  const [exams, setExams] = useState<Exam[]>([
    { 
      id: '1', 
      title: 'Geldrechnen', 
      subject: 'Mathematik', 
      date: '2023-11-25', 
      status: 'passed',
      content: 'Legacy exam content...'
    },
    { 
      id: '2', 
      title: 'Brüche & Dezimalzahlen', 
      subject: 'Mathematik', 
      date: '2025-12-29', 
      status: 'upcoming',
      content: `:::SECTION: plan:::
### 📅 Strukturierter Zeitplan

*   **Phase 1: Verstehen (Tag 1-2)**: Grundlagen der Brüche wiederholen.
*   **Phase 2: Üben (Tag 3-4)**: Addieren und Subtrahieren.
*   **Phase 3: Meisterschaft (Tag 5)**: Testsimulation.

:::SECTION: flashcards:::
Q: Was ist ein Zähler? | A: Die obere Zahl im Bruch.
Q: Was ist ein Nenner? | A: Die untere Zahl im Bruch.
`
    },
    { 
      id: '3', 
      title: 'Einzahl & Mehrzahl', 
      subject: 'Deutsch', 
      date: '2025-12-30', 
      status: 'ready',
      content: `:::SECTION: summary:::
### Zusammenfassung: Nomen
Nomen können in der Einzahl (Singular) oder Mehrzahl (Plural) stehen.
`
    },
  ]);

  const handleCreateComplete = (newExam: Exam) => {
    setExams(prev => [newExam, ...prev]);
    setCurrentPage('home');
  };

  const handleOpenExam = (exam: Exam) => {
    setActiveExam(exam);
    setCurrentPage('learning');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard onNavigate={setCurrentPage} exams={exams} onOpenExam={handleOpenExam} />;
      case 'create':
        return <CreateWizard onBack={() => setCurrentPage('home')} onComplete={handleCreateComplete} />;
      case 'learning':
        return activeExam ? (
          <LearningSession exam={activeExam} onBack={() => setCurrentPage('home')} />
        ) : (
          <Dashboard onNavigate={setCurrentPage} exams={exams} onOpenExam={handleOpenExam} />
        );
      case 'fortschritt':
        return <Progress />;
      case 'pruefungen':
        return <Exams exams={exams} onOpenExam={handleOpenExam} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-bold text-slate-600">Under Construction</h2>
            <p>Die Seite "{currentPage}" ist noch in Arbeit.</p>
            <button 
              onClick={() => setCurrentPage('home')} 
              className="mt-6 px-6 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600"
            >
              Zurück zum Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 ml-64 p-4 min-h-screen overflow-x-hidden">
        {renderPage()}
      </main>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;