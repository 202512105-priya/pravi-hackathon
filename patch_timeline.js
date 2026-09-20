const fs = require('fs');

let content = fs.readFileSync('src/components/family/Timeline.tsx', 'utf8');

const importReplacement = `import { sessionEvents } from '../../data/eventLogic';
import type { FamilyEvent } from '../../data/eventTypes';
import { useNavigate } from 'react-router-dom';
import { DetailedFamily } from '../../data/familyDetailMock';`;

content = content.replace("import { DetailedFamily } from '../../data/familyDetailMock';", importReplacement);

const newTimelineComponent = `
export function Timeline({ family }: { family: DetailedFamily }) {
  const navigate = useNavigate();

  // Inject session events into the timeline dynamically
  const familySessionEvents = sessionEvents.filter(e => e.familyId === family.id);
  
  const mergedTimeline = [
    ...family.timeline,
    ...familySessionEvents.map(e => ({
      id: e.id,
      date: e.effectiveDate,
      title: \`\${e.eventType.replace('_', ' ')} Reported\`,
      description: \`Impact assessment pending review. Reported by \${e.reportedBy}\`,
      type: "Event" as const,
      isSessionEvent: true
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        Family Timeline
      </h3>

      <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
        {mergedTimeline.map(event => (
          <div key={event.id} className="relative pl-6 group">
            <div className={\`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm \${
              (event as any).isSessionEvent ? 'bg-primary' :
              event.type === 'Creation' ? 'bg-green-500' :
              event.type === 'Update' ? 'bg-blue-500' : 'bg-slate-400'
            }\`} />
            <div className="mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{event.date}</span>
            </div>
            <h4 className="font-semibold text-slate-800 mb-1">{event.title}</h4>
            <p className="text-sm text-slate-600">{event.description}</p>
            {(event as any).isSessionEvent && (
              <button 
                onClick={() => navigate(\`/events/\${event.id}\`)}
                className="mt-2 text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                View Event Impact <MoveRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`;

content = content.replace(/export function Timeline.*?\}\);?\s*\}/s, newTimelineComponent);

fs.writeFileSync('src/components/family/Timeline.tsx', content);
