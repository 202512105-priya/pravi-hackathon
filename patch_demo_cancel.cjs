const fs = require('fs');

let content = fs.readFileSync('src/components/demo/GuidedDemo.tsx', 'utf8');

// Add a state to track if the demo prompt was dismissed
const stateReplacement = `export const GuidedDemoProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
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
};`;

content = content.replace(/export const GuidedDemoProvider: React\.FC[\s\S]*?<\/GuidedDemoContext\.Provider>\n  \);\n};/, stateReplacement);

const typeReplacement = `interface GuidedDemoContextType {
  activeJourney: string | null;
  stepIndex: number;
  isDismissed: boolean;
  startDemo: (journeyId: string) => void;
  stopDemo: () => void;
  nextStep: () => void;
  dismissPrompt: () => void;
}`;
content = content.replace(/interface GuidedDemoContextType \{[\s\S]*?\}/, typeReplacement);

const hookReplacement = `export function GuidedDemoOverlay() {
  const { activeJourney, stepIndex, stopDemo, nextStep, isDismissed, dismissPrompt } = useGuidedDemo();`;
content = content.replace(/export function GuidedDemoOverlay\(\) \{\n  const \{ activeJourney, stepIndex, stopDemo, nextStep \} = useGuidedDemo\(\);/, hookReplacement);

const renderReplacement = `if (!activeJourney) {
    if (isDismissed) return null;
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4">
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-slate-200 w-72 flex flex-col gap-3 relative">
          <button onClick={dismissPrompt} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-primary font-bold">
            <PlayCircle className="w-5 h-5" /> Interactive Demos
          </div>`;
content = content.replace(/if \(\!activeJourney\) \{\n    return \(\n      <div className="fixed bottom-6 right-6 z-50">\n        <div className="bg-white p-4 rounded-xl shadow-2xl border border-slate-200 w-72 flex flex-col gap-3">\n          <div className="flex items-center gap-2 text-primary font-bold">\n            <PlayCircle className="w-5 h-5" \/> Interactive Demos\n          <\/div>/, renderReplacement);

fs.writeFileSync('src/components/demo/GuidedDemo.tsx', content);
