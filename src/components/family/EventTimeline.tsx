import { useNavigate } from 'react-router-dom';
import type { DetailedFamily } from "../../data/familyDetailMock";
import { Card } from '../common/Card';
import { Clock, RefreshCw, FileText, CheckCircle2, AlertOctagon, MoveRight } from 'lucide-react';
import { sessionEvents } from '../../data/eventLogic';


export function EventTimeline({ family }: { family: DetailedFamily }) {
  const navigate = useNavigate();
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'Alert': return <AlertOctagon className="w-4 h-4 text-red-500" />;
      case 'Add': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'Update': return <RefreshCw className="w-4 h-4 text-saffron" />;
      case 'Status': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'SessionEvent': return <AlertOctagon className="w-4 h-4 text-primary" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const familySessionEvents = sessionEvents.filter(e => e.familyId === family.id);
  
  const mappedSessionEvents = familySessionEvents.map(e => ({
    id: e.id,
    type: 'SessionEvent',
    description: `${e.eventType.replace('_', ' ')} Reported: Impact assessment pending review. Reported by ${e.reportedBy}.`,
    timestamp: e.effectiveDate,
    isSessionEvent: true
  }));

  const mergedEvents = [...mappedSessionEvents, ...family.familyEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className="mb-6">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Family Event Timeline</h3>
      </div>
      
      <div className="p-5">
        <div className="relative border-l border-slate-200 ml-3 space-y-6">
          {mergedEvents.map(evt => {
            const [title, ...descParts] = evt.description.split(': ');
            const desc = descParts.join(': ');
            
            return (
              <div key={evt.id} className="relative pl-6">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                  {getIcon(evt.type)}
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">{evt.timestamp}</div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">{title}</h4>
                  {desc && <p className="text-sm text-slate-600">{desc}</p>}
                  
                  {(evt as any).isSessionEvent && (
                    <button 
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className="mt-2 text-xs font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      View Event Impact <MoveRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
