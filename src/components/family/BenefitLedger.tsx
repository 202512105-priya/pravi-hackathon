import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import type { DetailedFamily } from "../../data/familyDetailMock";
import type { Benefit } from "../../data/types";
import { Badge } from '../common/Badge';

const StatusBadge = ({ status }: { status: Benefit['status'] }) => {
  const map: Record<string, 'Success' | 'High' | 'Medium' | 'Low' | 'Neutral'> = {
    'Eligible': 'Neutral',
    'Applied': 'Low',
    'Verification Pending': 'Low',
    'Verified': 'Low',
    'Approved': 'Low',
    'Disbursement Initiated': 'Low',
    'Disbursed': 'Success',
    'Received': 'Success',
    'Completed': 'Success',
    'Rejected': 'High',
    'Suspended': 'Medium',
    'Expired': 'Neutral',
    'ACTIVE': 'Success',
    'PENDING': 'Low',
    'REVIEW REQUIRED': 'High',
    'SUSPENDED': 'Medium',
    'EXPIRED': 'Neutral',
  };
  return <Badge variant={map[status] || 'Neutral'}>{status}</Badge>;
};

export function BenefitLedger({ family }: { family: DetailedFamily }) {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col mb-6">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Consolidated Benefit Ledger</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 sticky top-0">
            <tr>
              <th className="px-5 py-3 font-medium">Department</th>
              <th className="px-5 py-3 font-medium">Scheme</th>
              <th className="px-5 py-3 font-medium">Beneficiary</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Last Action</th>
              <th className="px-5 py-3 font-medium">Next Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {family.benefits.map((b) => {
              const member = family.members.find(m => m.id === b.beneficiaryMemberId);
              return (
                <tr 
                  key={b.id} 
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => navigate(`/benefits/${b.id}`)}
                >
                  <td className="px-5 py-4 font-medium text-slate-700">{b.department}</td>
                  <td className="px-5 py-4 text-slate-600">{b.schemeName}</td>
                  <td className="px-5 py-4 text-slate-600">{member?.name || b.beneficiaryMemberId}</td>
                  <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-4 text-slate-500 text-xs">{b.lastTransaction}</td>
                  <td className="px-5 py-4 text-slate-500 text-xs font-medium">{b.nextReviewAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
