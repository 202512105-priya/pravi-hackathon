import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockBenefits, mockApplications, mockFamilies } from '../data/mockData';
import { sessionEvents } from '../data/eventLogic';
import { Badge } from '../components/common/Badge';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

export function SchemeDetail() {
  const { schemeId } = useParams<{ schemeId: string }>();
  const navigate = useNavigate();
  
  // Find benefits for this scheme
  const schemeBenefits = mockBenefits.filter(b => b.schemeId === schemeId);
  
  if (schemeBenefits.length === 0) {
    return <div className="p-8 text-center text-slate-500">Scheme not found or has no beneficiaries.</div>;
  }

  const schemeName = schemeBenefits[0].schemeName;
  const department = schemeBenefits[0].department;
  const totalSanctioned = schemeBenefits.reduce((sum, b) => sum + b.sanctionedAmount, 0);
  const totalPaid = schemeBenefits.reduce((sum, b) => sum + b.paidAmount, 0);

  const getStatusVariant = (status: string) => {
    if (['Completed', 'Disbursed', 'Active', 'Received'].includes(status)) return 'Success';
    if (['Rejected', 'Suspended'].includes(status)) return 'High';
    return 'Low';
  };

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    navigate(path);
  };

  return (
    <div className="pb-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500 font-medium">
        <Link to="/schemes" className="hover:text-primary transition flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Schemes</Link>
        <span>/</span>
        <span className="text-slate-800">{schemeId}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">{schemeName}</h1>
        <p className="text-slate-500">{department}</p>
        
        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100">
          <div>
            <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Enrolled Families</div>
            <div className="text-2xl font-bold text-slate-800">{schemeBenefits.length}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Total Allowed</div>
            <div className="text-2xl font-bold text-slate-800 font-mono">₹{totalSanctioned.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Total Spent</div>
            <div className="text-2xl font-bold text-green-600 font-mono">₹{totalPaid.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4">Beneficiary Pipeline</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Family ID</th>
                <th className="px-6 py-4 font-medium">Member ID</th>
                <th className="px-6 py-4 font-medium">Beneficiary Name</th>
                <th className="px-6 py-4 font-medium">Application Status (Stuck At)</th>
                <th className="px-6 py-4 font-medium">Benefit Status</th>
                <th className="px-6 py-4 font-medium text-right">Allowed</th>
                <th className="px-6 py-4 font-medium text-right">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schemeBenefits.map(b => {
                const family = mockFamilies.find(f => f.id === b.familyId);
                const member = family?.members.find(m => m.id === b.beneficiaryMemberId);
                const name = member?.name || 'Unknown';
                
                const app = mockApplications.find(a => a.id === b.applicationId);
                const memberEvents = sessionEvents.filter(e => e.familyId === b.familyId && (e.affectedMemberId === b.beneficiaryMemberId || !e.affectedMemberId) && e.status === 'REVIEW_REQUIRED');
                const hasEvent = memberEvents.length > 0;
                let appStatusNode = <span className="text-slate-400">No application</span>;
                
                if (app) {
                  if (app.status === 'Delayed') {
                    appStatusNode = <span className="text-red-600 font-medium">Stuck at: {app.currentStage} ({app.pendingDays}d)</span>;
                  } else if (app.currentStage === 'Delivered') {
                    appStatusNode = <span className="text-green-600">Delivered</span>;
                  } else {
                    appStatusNode = <span className="text-slate-600">Pending: {app.currentStage}</span>;
                  }
                }

                return (
                  <tr 
                    key={b.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/benefits/${b.id}`)}
                  >
                    <td className="px-6 py-4">
                      <button onClick={(e) => handleLinkClick(e, `/families/${b.familyId}`)} className="text-primary hover:underline hover:text-blue-800 font-medium">{b.familyId}</button>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{b.beneficiaryMemberId}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex flex-col">
                        <span>{name}</span>
                        {hasEvent && (
                          <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider mt-0.5">
                            {memberEvents[0].eventType.replace('_', ' ')} FLAG
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {app ? (
                        <button onClick={(e) => handleLinkClick(e, `/applications/${app.id}`)} className="hover:underline">
                          {appStatusNode}
                        </button>
                      ) : appStatusNode}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(b.status)}>{b.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-700">₹{b.sanctionedAmount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right font-mono text-green-700 font-medium">₹{b.paidAmount.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
