import { useNavigate } from 'react-router-dom';
import { AlertOctagon } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { mockAlerts } from '../../data/mockData';
import { Skeleton } from '../common/Skeleton';

export function DataQualityAlerts({ isLoading }: { isLoading?: boolean }) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full bg-slate-50 border-none shadow-none">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-xl">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-saffron" />
          Data Quality
        </h3>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : (
          mockAlerts.map(alert => (
            <div 
              key={alert.id}
              onClick={() => navigate('/conflicts')}
              className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-slate-700 text-sm">{alert.count} {alert.type}s</span>
                <Badge variant={alert.severity as any}>{alert.severity}</Badge>
              </div>
              <p className="text-xs text-slate-500">{alert.description}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
