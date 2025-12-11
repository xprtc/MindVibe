import React, { useState, useRef } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, UploadCloud, ChevronRight, Wand2, Check, Loader2, Type, Link as LinkIcon, FileText, Plus, Trash2, X, Target, File, Sparkles, BookOpen, Calculator, Brain, Mic, GraduationCap, Layout } from 'lucide-react';
import { generateStudyPlan } from '../services/geminiService';
import StudyContentRenderer from '../components/StudyContentRenderer';
import { Exam } from '../types';

interface CreateWizardProps {
  onBack: () => void;
  onComplete: (exam: Exam) => void;
}

interface Material {
  id: string;
  type: 'text' | 'link' | 'file';
  value: string;
  name?: string;
}

interface ContentOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const CreateWizard: React.FC<CreateWizardProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '2025-12-10',
    selectedContentTypes: [] as string[],
    generatedPlan: ''
  });

  // Material State for Step 1
  const [materials, setMaterials] = useState<Material[]>([]);
  const [inputType, setInputType] = useState<'text' | 'link' | 'file'>('text');
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contentOptions: ContentOption[] = [
    {
      id: 'plan',
      title: 'Strukturierter Zeitplan',
      description: 'Erstellt einen Lernplan bis zum Prüfungsdatum (Lernen, Wiederholen, Üben).',
      icon: <CalendarIcon size={24} className="text-blue-500" />
    },
    {
      id: 'solutions_practice',
      title: 'Lösungen & 3x Übung',
      description: 'Löst deine Aufgaben Schritt-für-Schritt und generiert 3x so viele ähnliche Musteraufgaben zum Üben.',
      icon: <Calculator size={24} className="text-fuchsia-500" />
    },
    {
      id: 'summary',
      title: 'Deep Dive Zusammenfassung',
      description: 'Detaillierte Erklärungen der Konzepte wie bei NotebookLM.',
      icon: <BookOpen size={24} className="text-emerald-500" />
    },
    {
      id: 'flashcards',
      title: 'Lernkarten & Abfrage',
      description: 'Generiert Fragen und Antworten für Active Recall.',
      icon: <Layout size={24} className="text-amber-500" />
    },
    {
      id: 'audio_script',
      title: 'Audio-Guide Skript',
      description: 'Ein Podcast-ähnliches Skript, um das Thema durch Hören zu verstehen (Learn About style).',
      icon: <Mic size={24} className="text-indigo-500" />
    },
    {
      id: 'mock_exam',
      title: 'Test-Simulation',
      description: 'Eine simulierte Prüfung mit Bewertungsschema.',
      icon: <GraduationCap size={24} className="text-red-500" />
    }
  ];

  const toggleContentOption = (id: string) => {
    setFormData(prev => {
      const exists = prev.selectedContentTypes.includes(id);
      if (exists) {
        return { ...prev, selectedContentTypes: prev.selectedContentTypes.filter(type => type !== id) };
      } else {
        return { ...prev, selectedContentTypes: [...prev.selectedContentTypes, id] };
      }
    });
  };

  const addMaterial = () => {
    if (!inputValue.trim() && inputType !== 'file') return;
    
    const newMaterial: Material = {
      id: Date.now().toString(),
      type: inputType,
      value: inputValue,
      name: inputType === 'link' ? inputValue : undefined
    };
    
    setMaterials(prev => [...prev, newMaterial]);
    setInputValue('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newMaterial: Material = {
        id: Date.now().toString(),
        type: 'file',
        value: file.name,
        name: file.name
      };
      setMaterials(prev => [...prev, newMaterial]);
      e.target.value = ''; // Reset to allow re-uploading same file
    }
  };

  const removeMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Combine all text materials for the prompt
      const combinedTopics = materials
        .map(m => `${m.type.toUpperCase()}: ${m.value}`)
        .join('\n');
      
      const plan = await generateStudyPlan(
        formData.subject, 
        formData.title, 
        formData.date, 
        combinedTopics,
        formData.selectedContentTypes
      );
      setFormData(prev => ({ ...prev, generatedPlan: plan }));
      setStep(3);
    } catch (e) {
      console.error(e);
      setFormData(prev => ({ ...prev, generatedPlan: "Fehler bei der Generierung. Bitte versuche es erneut." }));
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndExit = () => {
    const newExam: Exam = {
      id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      date: formData.date,
      status: 'upcoming',
      content: formData.generatedPlan
    };
    onComplete(newExam);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Neue Prüfung einrichten</h2>
          <p className="text-slate-500 text-sm">Schritt {step} von 3: {step === 1 ? 'Basisdaten & Material' : step === 2 ? 'KI-Konfiguration' : 'Resultate'}</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 relative overflow-hidden flex flex-col">
        
        {/* Step 1: Basic Info & Materials */}
        {step === 1 && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
            
            {/* Left Column: Basics */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">1. Basisdaten</h3>
                <p className="text-slate-500 text-sm">Worum geht es in dieser Prüfung?</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Titel der Prüfung *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="z.B. Mathe Abschlussprüfung" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Fach *</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                  >
                    <option value="">Fach wählen</option>
                    <option value="Mathematik">Mathematik</option>
                    <option value="Deutsch">Deutsch</option>
                    <option value="Englisch">Englisch</option>
                    <option value="Informatik">Informatik</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Prüfungsdatum *</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Material Collector */}
            <div className="space-y-6 flex flex-col h-full">
              <div>
                <h3 className="text-lg font-bold text-slate-800">2. Lernmaterial & Ziele</h3>
                <p className="text-slate-500 text-sm">Was möchtest du lernen? Füge alles hier hinzu.</p>
              </div>

              {/* Input Area */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                {/* Tabs */}
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                  <button 
                    onClick={() => setInputType('text')} 
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${inputType === 'text' ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Target size={16}/> Text/Ziel
                  </button>
                  <button 
                    onClick={() => setInputType('link')} 
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${inputType === 'link' ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <LinkIcon size={16}/> Link
                  </button>
                  <button 
                    onClick={() => setInputType('file')} 
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${inputType === 'file' ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <FileText size={16}/> Datei
                  </button>
                </div>

                {/* Input Fields */}
                <div className="space-y-3">
                  {inputType === 'text' && (
                    <textarea 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Was genau musst du wissen? Kopiere hier deine Lernziele oder Themenliste rein..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none h-24 resize-none text-sm"
                    />
                  )}
                  
                  {inputType === 'link' && (
                    <input 
                      type="url"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none text-sm"
                    />
                  )}

                  {inputType === 'file' && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-fuchsia-300 transition-colors bg-white"
                    >
                      <UploadCloud className="text-slate-400 mb-2" size={24}/>
                      <span className="text-sm text-slate-500">Datei auswählen</span>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </div>
                  )}

                  {inputType !== 'file' && (
                    <button 
                      onClick={addMaterial}
                      disabled={!inputValue.trim()}
                      className="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16}/> Hinzufügen
                    </button>
                  )}
                </div>
              </div>

              {/* Material List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-[100px]">
                {materials.length === 0 ? (
                  <div className="text-center text-slate-400 text-sm py-8 italic border border-dashed border-slate-200 rounded-xl">
                    Noch keine Inhalte hinzugefügt.
                  </div>
                ) : (
                  materials.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          item.type === 'text' ? 'bg-amber-50 text-amber-600' :
                          item.type === 'link' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {item.type === 'text' && <Target size={14}/>}
                          {item.type === 'link' && <LinkIcon size={14}/>}
                          {item.type === 'file' && <FileText size={14}/>}
                        </div>
                        <div className="truncate text-sm text-slate-700 font-medium">
                          {item.value}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeMaterial(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Content Selection (AI Configuration) */}
        {step === 2 && (
          <div className="animate-fade-in space-y-8 max-w-5xl mx-auto w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                <Sparkles className="text-fuchsia-500" /> KI-Konfigurator
              </h3>
              <p className="text-slate-500 mt-2">Was soll MindVibe für dich erstellen? Wähle deine gewünschten Inhalte.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentOptions.map((option) => {
                 const isSelected = formData.selectedContentTypes.includes(option.id);
                 return (
                   <div 
                    key={option.id}
                    onClick={() => toggleContentOption(option.id)}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 relative group ${
                      isSelected 
                        ? 'bg-fuchsia-50 border-fuchsia-500 shadow-md shadow-fuchsia-100' 
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                    }`}
                   >
                     {isSelected && (
                       <div className="absolute top-3 right-3 bg-fuchsia-500 text-white rounded-full p-1">
                         <Check size={12} strokeWidth={3} />
                       </div>
                     )}
                     <div className="mb-4">{option.icon}</div>
                     <h4 className={`font-bold text-lg mb-2 ${isSelected ? 'text-fuchsia-800' : 'text-slate-800'}`}>{option.title}</h4>
                     <p className={`text-sm leading-relaxed ${isSelected ? 'text-fuchsia-600' : 'text-slate-500'}`}>{option.description}</p>
                   </div>
                 );
              })}
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-200 text-center max-w-lg">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Hinweis:</span> Wir analysieren deine {materials.length} Quellen und generieren basierend darauf die ausgewählten Inhalte. 
                  Der Zeitplan wird automatisch bis zum {new Date(formData.date).toLocaleDateString('de-DE')} berechnet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Result (Preview & Save) */}
        {step === 3 && (
          <div className="animate-fade-in h-full flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
             <div className="text-center mb-6">
               <div className="w-12 h-12 bg-gradient-to-tr from-fuchsia-500 to-purple-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-200">
                 <Check size={24} />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-1">Dein Lern-Paket ist fertig!</h3>
               <p className="text-slate-500 text-sm">
                 Vorschau für <span className="font-semibold text-fuchsia-600">{formData.title}</span>.
               </p>
             </div>

             <div className="w-full flex-1 min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
               <StudyContentRenderer content={formData.generatedPlan} />
             </div>

             <div className="mt-6">
                <button 
                  onClick={handleSaveAndExit}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-colors shadow-lg"
                >
                  Zum Dashboard speichern
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      {step < 3 && (
        <div className="mt-6 flex justify-end">
          {step === 1 ? (
             <button 
             onClick={() => setStep(2)}
             disabled={!formData.title || !formData.subject || materials.length === 0}
             className="px-8 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center gap-2"
           >
             Weiter zu Schritt 2 <ChevronRight size={18} />
           </button>
          ) : (
            <button 
              onClick={handleGenerate}
              disabled={loading || formData.selectedContentTypes.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <Wand2 size={18} />}
              {loading ? 'Generiere Inhalte...' : 'Generieren starten'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateWizard;