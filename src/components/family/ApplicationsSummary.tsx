import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import type { DetailedFamily } from '../../data/familyDetailMock';
import type { Application, ApplicationStage } from '../../data/types';
import { Badge } from '../common/Badge';

const STAGES: ApplicationStage[] = ['Submitted', 'Document Verification', 'Department Verification', 'Approved', 'Payment', 'Delivered'];

const PipelineVisual = ({ app }: { app: Application }) => {
  const currentIdx = STAGES.indexOf(app.currentStage);
  
  return (
    <div className="flex items-center w-full max-w-sm mt-3">
      {STAGES.map((stage, idx) => {
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isStuck = isCurrent && app.status === 'Delayed';
        
        return (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            <div className="relative group">
              <div className={`w-3 h-3 rounded-full border-2 ${
                isPast ? 'bg-green-500 border-green-500' : 
                isStuck ? 'bg-red-500 border-red-500 animate-pulse' :
                isCurrent ? 'bg-primary border-primary' : 
                'bg-white border-slate-300'
              }`} />
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white p-1 rounded shadow-sm border border-slate-200">
                {stage}
              </div>
            </div>
            {idx < STAGES.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${
                isPast ? 'bg-green-500' : 'bg-slate-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export function ApplicationsSummary({ family }: { family: DetailedFamily }) {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col mb-6">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Applications</h3>
      </div>
      
      <div className="divide-y divide-slate-100">
        {family.applications.map(app => {
          const member = family.members.find(m => m.id === app.beneficiaryMemberId);
          return (
            <div 
              key={app.id} 
              className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer ${app.status === 'Delayed' ? 'bg-red-50/30' : ''}`}
              onClick={() => navigate(`/applications/${app.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-slate-800">{app.schemeName}</h4>
                  <p className="text-sm text-slate-500">Applicant: {member?.name}</p>
                </div>
                <div className="text-right">
                  <Badge variant={app.status === 'Stuck' ? 'High' : 'Low'}>{app.status}</Badge>
                  <p className="text-xs text-slate-500 mt-1">Pending {app.pendingDays} days</p>
                </div>
              </div>
              <PipelineVisual app={app} />
              {app.status === 'Stuck' && (
                <p className="text-xs font-medium text-red-600 mt-4">
                  ⚠ Stuck at {app.currentStage}. Attention required.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
