import { Badge } from '../common/Badge';
import type { DetailedFamily } from "../../data/familyDetailMock";
import { CheckCircle, AlertTriangle, FileText, CheckSquare } from 'lucide-react';

export function FamilyHeader({ family }: { family: DetailedFamily }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-primary">{family.id}</h1>
            <Badge variant={family.rationCardStatus === 'Active' ? 'Success' : 'High'}>
              {family.rationCardStatus}
            </Badge>
          </div>
          <div className="text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="font-medium text-slate-800">{family.headName}</span>
            <span>•</span>
            <span>{family.village}, {family.taluka}, {family.district}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded">
              <CheckCircle className="w-3 h-3" />
              Verified: {family.lastVerified}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm">
            <CheckSquare className="w-4 h-4" />
            Create Review Task
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm">
            <FileText className="w-4 h-4" />
            Report Event
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition font-medium text-sm">
            <AlertTriangle className="w-4 h-4" />
            Resolve Conflict
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
        <div className="flex flex-col">
          <span className="text-slate-500 text-sm font-medium">Members</span>
          <span className="text-2xl font-bold text-slate-800">{family.members.length}</span>
        </div>
        <div className="flex flex-col border-l pl-4 border-slate-100">
          <span className="text-slate-500 text-sm font-medium">Active Benefits</span>
          <span className="text-2xl font-bold text-slate-800">
            {family.benefits.filter(b => b.status === 'Completed').length}
          </span>
        </div>
        <div className="flex flex-col border-l pl-4 border-slate-100">
          <span className="text-slate-500 text-sm font-medium">Pending Apps</span>
          <span className="text-2xl font-bold text-slate-800">{family.applications.length}</span>
        </div>
      </div>
    </div>
  );
}
