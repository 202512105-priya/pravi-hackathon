import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockBenefits, mockFamilies } from '../data/mockData';
import { Badge } from '../components/common/Badge';

export function Benefits() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Enhance benefits with beneficiary name
  const enrichedBenefits = mockBenefits.map(b => {
    const family = mockFamilies.find(f => f.id === b.familyId);
    const member = family?.members.find(m => m.id === b.beneficiaryMemberId);
    return { ...b, beneficiaryName: member?.name || 'Unknown' };
  });

  const filtered = enrichedBenefits.filter(b => {
    if (filterDept !== 'All' && b.department !== filterDept) return false;
    if (filterStatus !== 'All' && b.status !== filterStatus) return false;
    
    const searchLower = searchTerm.toLowerCase();
    if (searchTerm && !(
      b.familyId.toLowerCase().includes(searchLower) ||
      b.beneficiaryMemberId.toLowerCase().includes(searchLower) ||
      b.beneficiaryName.toLowerCase().includes(searchLower) ||
      b.schemeName.toLowerCase().includes(searchLower)
    )) return false;
    
    return true;
  });

  // KPI Calculations
  const totalBenefits = mockBenefits.length;
  const activeReceived = mockBenefits.filter(b => ['Active', 'Completed', 'Disbursed', 'Received'].includes(b.status)).length;
  const pendingBenefits = mockBenefits.filter(b => ['Verification Pending', 'Applied'].includes(b.status)).length;
  const rejectedBenefits = mockBenefits.filter(b => b.status === 'Rejected').length;
  const totalSanctioned = mockBenefits.reduce((sum, b) => sum + b.sanctionedAmount, 0);
  const totalPaid = mockBenefits.reduce((sum, b) => sum + b.paidAmount, 0);

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-1">Benefit Ledger</h1>
        <p className="text-slate-500">Comprehensive view of all benefits disbursed at the scheme, family, and beneficiary level.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Total Benefits</div>
          <div className="text-xl font-bold text-slate-800">{totalBenefits}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Active/Received</div>
          <div className="text-xl font-bold text-green-600">{activeReceived}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Pending</div>
          <div className="text-xl font-bold text-saffron">{pendingBenefits}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Rejected</div>
          <div className="text-xl font-bold text-red-600">{rejectedBenefits}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Total Sanctioned</div>
          <div className="text-xl font-bold text-slate-800 font-mono text-sm">₹{totalSanctioned.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Total Paid</div>
          <div className="text-xl font-bold text-green-600 font-mono text-sm">₹{totalPaid.toLocaleString('en-IN')}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-2 items-center">
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-primary">
            <option value="All">All Departments</option>
            <option value="PDS">PDS</option>
            <option value="Education">Education</option>
            <option value="Housing">Housing</option>
            <option value="Health">Health</option>
            <option value="Pension">Pension</option>
            <option value="WCD">WCD</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-primary">
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Verification Pending">Verification Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Active">Active</option>
          </select>
          <input 
            type="text" 
            placeholder="Search Scheme, Family, Member, Name..." 
            className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-primary ml-auto min-w-[280px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No benefits found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Scheme</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Department</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Family ID</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Member ID</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Beneficiary</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Sanctioned</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Paid</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">App ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(b => (
                  <tr 
                    key={b.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    onClick={() => navigate(`/benefits/${b.id}`)}
                  >
                    <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">{b.schemeName}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.department}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button 
                        onClick={(e) => handleLinkClick(e, `/families/${b.familyId}`)}
                        className="text-primary hover:underline hover:text-blue-800"
                      >
                        {b.familyId}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button 
                        onClick={(e) => handleLinkClick(e, `/families/${b.familyId}`)}
                        className="text-primary hover:underline hover:text-blue-800"
                      >
                        {b.beneficiaryMemberId}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium whitespace-nowrap">{b.beneficiaryName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={getStatusVariant(b.status)}>
                        {b.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">₹{b.sanctionedAmount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-mono text-green-700 font-medium whitespace-nowrap">₹{b.paidAmount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {b.applicationId ? (
                        <button 
                          onClick={(e) => handleLinkClick(e, `/applications/${b.applicationId}`)}
                          className="text-primary hover:underline hover:text-blue-800 text-xs"
                        >
                          {b.applicationId}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
