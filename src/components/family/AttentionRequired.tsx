import { useNavigate } from 'react-router-dom';
import type { DetailedFamily } from '../../data/familyDetailMock';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export function AttentionRequired({ family }: { family: DetailedFamily }) {
  const navigate = useNavigate();

  const handleActionClick = (alert: any) => {
    if (alert.type === 'Data Conflict' || alert.type === 'Conflict') {
      navigate('/conflicts/CON-001');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        Attention Required
      </h3>
      
      <div className="space-y-3">
        {family.alerts.map(alert => (
          <div key={alert.id} className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
            alert.severity === 'High' ? 'border-red-200 border-l-4 border-l-red-500' :
            alert.severity === 'Medium' ? 'border-saffron/30 border-l-4 border-l-saffron' :
            'border-blue-200 border-l-4 border-l-blue-500'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                alert.severity === 'High' ? 'text-red-600' :
                alert.severity === 'Medium' ? 'text-saffron' : 'text-blue-600'
              }`}>
                {alert.type} — {alert.severity}
              </span>
            </div>
            <h4 className="font-semibold text-slate-800 mb-1">{alert.problem}</h4>
            <p className="text-sm text-slate-600 mb-3">{alert.reason}</p>
            <div 
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-blue-800 transition-colors"
              onClick={() => handleActionClick(alert)}
            >
              Action: {alert.action} <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
