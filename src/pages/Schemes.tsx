import { useNavigate } from 'react-router-dom';
import { mockBenefits } from '../data/mockData';

export function Schemes() {
  const navigate = useNavigate();
  
  // Group benefits by scheme
  const schemesMap = new Map();
  
  mockBenefits.forEach(b => {
    if (!schemesMap.has(b.schemeId)) {
      schemesMap.set(b.schemeId, {
        id: b.schemeId,
        name: b.schemeName,
        department: b.department,
        totalBeneficiaries: 0,
        totalSanctioned: 0,
        totalPaid: 0,
      });
    }
    const scheme = schemesMap.get(b.schemeId);
    scheme.totalBeneficiaries += 1;
    scheme.totalSanctioned += b.sanctionedAmount;
    scheme.totalPaid += b.paidAmount;
  });

  const schemes = Array.from(schemesMap.values());

  return (
    <div className="pb-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-1">Beneficiary Workflows (Schemes)</h1>
        <p className="text-slate-500">View aggregate disbursements and navigate into scheme-specific beneficiary lists.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Scheme Name</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium text-right">Beneficiaries Enrolled</th>
                <th className="px-6 py-4 font-medium text-right">Money Allowed (Sanctioned)</th>
                <th className="px-6 py-4 font-medium text-right">Money Spent (Paid)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schemes.map(s => (
                <tr 
                  key={s.id} 
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/schemes/${s.id}`)}
                >
                  <td className="px-6 py-4 font-semibold text-primary">{s.name}</td>
                  <td className="px-6 py-4 text-slate-600">{s.department}</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-800">{s.totalBeneficiaries}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700">₹{s.totalSanctioned.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right font-mono text-green-700 font-medium">₹{s.totalPaid.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
