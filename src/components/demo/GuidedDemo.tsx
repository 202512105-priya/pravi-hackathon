import React, { createContext, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlayCircle, X, ChevronRight, Check } from 'lucide-react';


const DEMO_JOURNEYS = {
  journey1: [
    { path: '/dashboard', title: 'Start Journey', content: 'We will investigate a high-risk family (GJ-F-10293) and create a review task.', actionRequired: 'Click "Families" in the sidebar.' },
    { path: '/families', title: 'Find the Family', content: 'Select Family GJ-F-10293 from the list.', actionRequired: 'Click on GJ-F-10293.' },
    { path: '/families/GJ-F-10293', title: 'Analyze Family', content: 'Notice the red Attention Required box. The housing application is delayed by 42 days.', actionRequired: 'Click "Create Review Task" (Demo button).' }
  ],
  journey2: [
    { path: '/dashboard', title: 'Start Event Reporting', content: 'We will simulate reporting a death event for a family.', actionRequired: 'Click "Events" in the sidebar.' },
    { path: '/events', title: 'Report Event', content: 'Here you can file a new event. Let\'s proceed to the family profile to file it directly.', actionRequired: 'Navigate to family GJ-F-10293.' },
    { path: '/families/GJ-F-10293', title: 'File Event', content: 'Click "Report Event" in the header.', actionRequired: 'Click the Report Event button.' }
  ]
};

interface GuidedDemoContextType {
  activeJourney: string | null;
  stepIndex: number;
  isDismissed: boolean;
  startDemo: (journeyId: string) => void;
  stopDemo: () => void;
  nextStep: () => void;
  dismissPrompt: () => void;
}

const GuidedDemoContext = createContext<GuidedDemoContextType>({} as GuidedDemoContextType);

export const GuidedDemoProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [activeJourney, setActiveJourney] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const startDemo = (journeyId: string) => {
    setActiveJourney(journeyId);
    setStepIndex(0);
    setIsDismissed(false);
  };

  const stopDemo = () => {
    setActiveJourney(null);
    setStepIndex(0);
  };

  const dismissPrompt = () => {
    setIsDismissed(true);
  };

  const nextStep = () => {
    setStepIndex(prev => prev + 1);
  };

  return (
    <GuidedDemoContext.Provider value={{ activeJourney, stepIndex, startDemo, stopDemo, nextStep, isDismissed, dismissPrompt }}>
      {children}
    </GuidedDemoContext.Provider>
  );
};

export const useGuidedDemo = () => useContext(GuidedDemoContext);

export function GuidedDemoOverlay() {
  const { activeJourney, stepIndex, stopDemo, nextStep, isDismissed, dismissPrompt } = useGuidedDemo();
  const location = useLocation();
  const navigate = useNavigate();

  // Exclude overlay from login page
  if (location.pathname === '/login') return null;

  if (!activeJourney) {
    if (isDismissed) return null;
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4">
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-slate-200 w-72 flex flex-col gap-3 relative">
          <button onClick={dismissPrompt} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-primary font-bold">
            <PlayCircle className="w-5 h-5" /> Interactive Demos
          </div>
          <button onClick={() => { navigate('/dashboard'); useGuidedDemo().startDemo('journey1'); }} className="text-left text-sm p-2 hover:bg-slate-50 border border-slate-200 rounded flex justify-between items-center group">
            <span className="font-medium text-slate-700">1. Conflict Resolution</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary" />
          </button>
          <button onClick={() => { navigate('/dashboard'); useGuidedDemo().startDemo('journey2'); }} className="text-left text-sm p-2 hover:bg-slate-50 border border-slate-200 rounded flex justify-between items-center group">
            <span className="font-medium text-slate-700">2. Event Impact</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary" />
          </button>
        </div>
      </div>
    );
  }

  const journey = DEMO_JOURNEYS[activeJourney as keyof typeof DEMO_JOURNEYS];
  const step = journey[stepIndex];

  if (!step) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-green-50 p-5 rounded-xl shadow-2xl border border-green-200 w-80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-green-700 font-bold">
            <Check className="w-5 h-5" /> Demo Completed!
          </div>
          <button onClick={stopDemo} className="text-green-500 hover:text-green-700"><X className="w-4 h-4" /></button>
        </div>
        <p className="text-sm text-green-800">You have successfully completed the guided journey.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-blue-900 text-white p-5 rounded-xl shadow-2xl border border-blue-700 w-80 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-start mb-3">
        <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">Step {stepIndex + 1} of {journey.length}</div>
        <button onClick={stopDemo} className="text-blue-300 hover:text-white"><X className="w-4 h-4" /></button>
      </div>
      <h3 className="font-bold text-lg mb-2">{step.title}</h3>
      <p className="text-sm text-blue-100 mb-4">{step.content}</p>
      
      <div className="bg-blue-800/50 p-3 rounded-lg text-sm border border-blue-700/50 flex items-start gap-2">
        <div className="w-2 h-2 rounded-full bg-saffron mt-1.5 animate-pulse shrink-0" />
        <span className="font-medium text-blue-50">{step.actionRequired}</span>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button onClick={nextStep} className="text-sm font-bold bg-white text-blue-900 px-4 py-1.5 rounded hover:bg-blue-50 transition">Next Step</button>
      </div>
    </div>
  );
}
