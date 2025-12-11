
import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Layout, 
  MessageCircle, 
  BookOpen, 
  GraduationCap, 
  Calculator, 
  ChevronRight, 
  ChevronLeft,
  RotateCw,
  Eye,
  EyeOff,
  Play
} from 'lucide-react';

interface StudyContentRendererProps {
  content: string;
}

type SectionType = 'plan' | 'solutions_practice' | 'summary' | 'flashcards' | 'audio_script' | 'mock_exam' | 'generic';

interface ParsedSection {
  type: SectionType;
  content: string;
}

const StudyContentRenderer: React.FC<StudyContentRendererProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState<SectionType | null>(null);

  // Parse the content string into structured sections
  const sections = useMemo(() => {
    if (!content) return [];
    
    // Split by the delimiter :::SECTION: type:::
    const parts = content.split(':::SECTION:');
    
    const parsed: ParsedSection[] = parts
      .filter(part => part.trim().length > 0)
      .map(part => {
        const firstLineEnd = part.indexOf(':::');
        if (firstLineEnd === -1) return { type: 'generic', content: part };

        const type = part.substring(0, firstLineEnd).trim() as SectionType;
        const text = part.substring(firstLineEnd + 3).trim();
        
        return { type, content: text };
      });

    // Handle legacy/plain content
    if (parsed.length === 0 && content.length > 0) {
        return [{ type: 'generic', content: content }];
    }

    return parsed;
  }, [content]);

  // Set initial tab
  React.useEffect(() => {
    if (sections.length > 0 && !activeTab) {
      setActiveTab(sections[0].type);
    }
  }, [sections, activeTab]);

  if (!content) return null;

  const renderActiveSection = () => {
    const current = sections.find(s => s.type === activeTab);
    if (!current) return <div className="p-8 text-center text-slate-400">Wähle einen Bereich aus.</div>;

    switch (current.type) {
      case 'flashcards':
        return <FlashcardDeck content={current.content} />;
      case 'plan':
        return <TimelineView content={current.content} />;
      case 'audio_script':
        return <ChatScriptViewer content={current.content} />;
      case 'solutions_practice':
        return <PracticeView content={current.content} />;
      case 'mock_exam':
        return <MockExamView content={current.content} />;
      default:
        return <MarkdownView content={current.content} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto p-2 bg-white border-b border-slate-100 gap-2 sticky top-0 z-10 no-scrollbar">
        {sections.map((section) => (
          <button
            key={section.type}
            onClick={() => setActiveTab(section.type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === section.type 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {getIconForType(section.type)}
            {getLabelForType(section.type)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
           {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components for Interaction ---

const FlashcardDeck = ({ content }: { content: string }) => {
  // Parse: Q: Question | A: Answer
  const cards = useMemo(() => {
    return content.split('\n')
      .filter(line => line.includes('|'))
      .map(line => {
        const [q, a] = line.split('|');
        return { 
          q: q.replace('Q:', '').trim(), 
          a: a.replace('A:', '').trim() 
        };
      });
  }, [content]);

  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (cards.length === 0) return <MarkdownView content={content} />;

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => setIndex((prev) => (prev + 1) % cards.length), 150);
  };
  
  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => setIndex((prev) => (prev - 1 + cards.length) % cards.length), 150);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-full max-w-md perspective-1000">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-64 bg-white rounded-3xl shadow-xl cursor-pointer transition-all duration-500 transform-style-3d border border-slate-100 ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center">
            <span className="text-xs font-bold text-fuchsia-500 uppercase tracking-widest mb-4">Frage {index + 1}/{cards.length}</span>
            <p className="text-xl font-bold text-slate-800">{cards[index].q}</p>
            <p className="text-xs text-slate-400 mt-6">(Klicken zum Umdrehen)</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white rounded-3xl rotate-y-180" style={{ transform: 'rotateY(180deg)' }}>
            <span className="text-xs font-bold text-white/70 uppercase tracking-widest mb-4">Antwort</span>
            <p className="text-lg font-medium">{cards[index].a}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <button onClick={prevCard} className="p-4 rounded-full bg-white shadow-md hover:bg-slate-50 text-slate-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => setIsFlipped(!isFlipped)} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm text-fuchsia-600 font-medium hover:bg-fuchsia-50 transition-colors border border-fuchsia-100">
          <RotateCw size={18} /> {isFlipped ? 'Frage sehen' : 'Antwort zeigen'}
        </button>
        <button onClick={nextCard} className="p-4 rounded-full bg-white shadow-md hover:bg-slate-50 text-slate-600 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

const TimelineView = ({ content }: { content: string }) => {
  // Simple heuristic: Split by lines starting with * or -
  const items = content.split('\n').filter(line => line.trim().length > 0);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="text-blue-500" />
        Dein Lernplan
      </h3>
      <div className="space-y-0 relative pl-4 border-l-2 border-blue-100">
        {items.map((item, idx) => {
          const isPhase = item.toLowerCase().includes('phase') || item.includes('###');
          return (
            <div key={idx} className={`relative pl-6 pb-6 ${isPhase ? 'mt-4' : ''}`}>
               <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${isPhase ? 'bg-blue-500 w-4 h-4 -left-[23px]' : 'bg-slate-300'}`}></div>
               <div className={`${isPhase ? 'font-bold text-slate-800 text-lg' : 'text-slate-600'}`}>
                  {item.replace(/[*#]/g, '')}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChatScriptViewer = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-xl mx-auto">
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
         <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
           <Play size={20} fill="currentColor" />
         </div>
         <div>
           <h4 className="font-bold text-slate-800">Audio-Guide</h4>
           <p className="text-xs text-slate-500">Podcast Skript</p>
         </div>
      </div>
      <div className="p-6 space-y-4 bg-slate-50/50">
        {lines.map((line, idx) => {
          const isHost = line.toLowerCase().startsWith('host') || line.toLowerCase().startsWith('moderator');
          const [speaker, ...textParts] = line.split(':');
          const text = textParts.join(':');

          if (!text) return <div key={idx} className="text-center text-xs text-slate-400 my-4 uppercase tracking-wider">{line}</div>;

          return (
            <div key={idx} className={`flex gap-3 ${isHost ? 'flex-row' : 'flex-row-reverse'}`}>
               <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isHost ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                 {speaker.substring(0, 1)}
               </div>
               <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${isHost ? 'bg-white rounded-tl-none border border-slate-100 text-slate-700' : 'bg-indigo-500 text-white rounded-tr-none shadow-md shadow-indigo-100'}`}>
                 <span className="block font-bold text-[10px] opacity-70 mb-1">{speaker}</span>
                 {text}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PracticeView = ({ content }: { content: string }) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 text-sm flex items-start gap-3">
        <Calculator className="shrink-0 mt-0.5" size={18} />
        <div>
          <span className="font-bold">Anleitung:</span> Versuche erst die Aufgaben selbst zu lösen, bevor du dir die Lösungen ansiehst.
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <MarkdownView content={content} />
        
        {/* Simple spoiler implementation if "Lösung" detected but not properly sectioned */}
        {content.toLowerCase().includes('lösung') && (
           <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-20 pb-4 flex justify-center">
             <button 
               onClick={() => setShowSolution(!showSolution)}
               className="bg-slate-900 text-white px-6 py-2 rounded-full shadow-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
             >
               {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
               {showSolution ? 'Lösungen verbergen' : 'Lösungen aufdecken'}
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

const MockExamView = ({ content }: { content: string }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
           <h3 className="text-2xl font-bold text-slate-800">Simulation</h3>
           <p className="text-slate-500">Prüfungsmodus</p>
        </div>
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
           <GraduationCap size={24} />
        </div>
      </div>
      <MarkdownView content={content} />
    </div>
  );
};

const MarkdownView = ({ content }: { content: string }) => {
  // Simple renderer that respects newlines and basic markdown headers
  const lines = content.split('\n');
  return (
    <div className="prose prose-slate max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold text-slate-800 mt-6 mb-3">{line.replace('###', '')}</h3>;
        if (line.startsWith('##')) return <h2 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-4 pb-2 border-b border-slate-100">{line.replace('##', '')}</h2>;
        if (line.startsWith('*') || line.startsWith('-')) return <li key={i} className="ml-4 text-slate-700 my-1">{line.replace(/[*|-]/, '')}</li>;
        if (line.trim() === '') return <div key={i} className="h-2"></div>;
        return <p key={i} className="text-slate-600 leading-relaxed mb-2">{line}</p>;
      })}
    </div>
  );
};

// --- Helpers ---

const getLabelForType = (type: SectionType) => {
  switch (type) {
    case 'plan': return 'Zeitplan';
    case 'solutions_practice': return 'Lösungen & Übung';
    case 'summary': return 'Zusammenfassung';
    case 'flashcards': return 'Lernkarten';
    case 'audio_script': return 'Audio-Guide';
    case 'mock_exam': return 'Simulation';
    default: return 'Übersicht';
  }
};

const getIconForType = (type: SectionType) => {
  const size = 16;
  switch (type) {
    case 'plan': return <Calendar size={size} className="text-blue-500" />;
    case 'solutions_practice': return <CheckCircle2 size={size} className="text-fuchsia-500" />;
    case 'summary': return <BookOpen size={size} className="text-emerald-500" />;
    case 'flashcards': return <Layout size={size} className="text-amber-500" />;
    case 'audio_script': return <MessageCircle size={size} className="text-indigo-500" />;
    case 'mock_exam': return <GraduationCap size={size} className="text-red-500" />;
    default: return <BookOpen size={size} />;
  }
};

export default StudyContentRenderer;
