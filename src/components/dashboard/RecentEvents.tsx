import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { mockEvents } from '../../data/mockData';
import { UserPlus, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { Skeleton } from '../common/Skeleton';

const eventIcons = {
  Add: <UserPlus className="w-4 h-4 text-green-600" />,
  Alert: <AlertCircle className="w-4 h-4 text-red-600" />,
  Status: <RefreshCw className="w-4 h-4 text-saffron" />,
  Update: <FileText className="w-4 h-4 text-blue-600" />
};

export function RecentEvents({ isLoading }: { isLoading?: boolean }) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full max-h-96">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Recent Events</h3>
        <button onClick={() => navigate('/events')} className="text-primary text-sm font-medium hover:underline">View All</button>
      </div>
      
      <div className="flex-1 overflow-auto p-5">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {mockEvents.map((evt, idx) => (
              <div 
                key={evt.id} 
                className="relative flex gap-4 cursor-pointer group"
                onClick={() => navigate(`/families/${evt.familyId}`)}
              >
                {idx !== mockEvents.length - 1 && (
                  <div className="absolute top-8 left-4 bottom-[-24px] w-0.5 bg-slate-200" />
                )}
                
                <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
                  {eventIcons[evt.type]}
                </div>
                
                <div className="flex-1 pb-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-primary text-sm">{evt.familyId}</span>
                    <span className="text-xs text-slate-400">{evt.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-600">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
