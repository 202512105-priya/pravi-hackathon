import { useParams, Link } from 'react-router-dom';


// Note: The Analytics component already has a scope selector for District.
// For /analytics/districts/:districtId, we could render a specialized view, 
// or simply wrap the Analytics component and inject the districtId into it.
// To satisfy the specific prompt structure, we will build a dedicated wrapper or specialized UI.


import { useNavigate } from 'react-router-dom';
import { 
  calculateUniqueFamiliesReceivingBenefits, calculateApplicationFunnel, calculatePendingByStage, 
  calculateConflictCategories, calculatePotentialBenefitGaps, calculateFamiliesWithMultipleIssues 
} from '../data/analyticsLogic';
import { mockApplications } from '../data/mockData';
import { mockConflicts } from '../data/conflictMockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { ArrowLeft, FileWarning } from 'lucide-react';

export function DistrictAnalytics() {
  const { districtId } = useParams<{ districtId: string }>();
  const navigate = useNavigate();

  // If we just want to reuse the exact same dashboard scoped, we could do:
  // return <Analytics initialScope="District" initialDistrict={districtId} /> 
  // But let's build the explicit layout requested in the brief:
  
  if (!districtId) return <div>District not found</div>;

  const kpis = {
    uniqueFamilies: calculateUniqueFamiliesReceivingBenefits(districtId),
    activeApps: mockApplications.filter(a => a.district === districtId && a.currentStage !== 'Delivered' && a.currentStage !== 'Rejected').length,
    pendingApps: calculatePendingByStage(districtId).reduce((sum, s) => sum + s.count, 0),
    openConflicts: mockConflicts.filter(c => c.status === 'OPEN' && c.district === districtId).length,
    benefitGaps: calculatePotentialBenefitGaps(districtId).length
  };

  const depts = ["Health", "Education", "PDS", "Housing", "Pension", "WCD"];
  const deptData = depts.map(dept => {
    return {
      department: dept,
      applications: mockApplications.filter(a => a.district === districtId && a.department === dept).length
    };
  });

  const funnelData = calculateApplicationFunnel(districtId);
  const conflictCategories = calculateConflictCategories(districtId);
  const attentionFamilies = calculateFamiliesWithMultipleIssues(districtId);

  return (
    <div className="pb-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500 font-medium">
        <Link to="/analytics" className="hover:text-primary transition flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> State Analytics</Link>
        <span>/</span>
        <span className="text-slate-800">{districtId} District</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-1">{districtId} District Dashboard</h1>
        <p className="text-slate-500">Synthetic demographic and operational performance data localized to {districtId}.</p>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Families Receiving Benefits</div>
          <div className="text-2xl font-bold text-slate-800">{kpis.uniqueFamilies}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Active Applications</div>
          <div className="text-2xl font-bold text-slate-800">{kpis.activeApps}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Pending Applications</div>
          <div className="text-2xl font-bold text-saffron">{kpis.pendingApps}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Open Conflicts</div>
          <div className="text-2xl font-bold text-red-600">{kpis.openConflicts}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Potential Benefit Gaps</div>
          <div className="text-2xl font-bold text-amber-600">{kpis.benefitGaps}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Department Breakdown (Applications)</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="department" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="applications" radius={[0, 4, 4, 0]} fill="#3b82f6">
                  <LabelList dataKey="applications" position="right" fill="#64748b" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Application Funnel */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Application Bottlenecks</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} onClick={() => navigate('/applications')} className="cursor-pointer">
                  {funnelData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index > 2 ? (index > 4 ? '#10b981' : '#3b82f6') : '#94a3b8'} />
                  ))}
                  <LabelList dataKey="count" position="right" fill="#64748b" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* District Conflicts */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Conflicts Breakdown</h2>
        <div className="flex gap-4 overflow-x-auto">
          {conflictCategories.map(c => (
            <div key={c.name} className="min-w-[200px] border border-slate-200 rounded-lg p-4 bg-slate-50 cursor-pointer hover:border-red-300" onClick={() => navigate(`/conflicts?type=${c.originalType}`)}>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">{c.name}</div>
              <div className="text-xl font-bold text-red-600">{c.count}</div>
            </div>
          ))}
          {conflictCategories.length === 0 && (
            <div className="text-slate-500 italic p-4">No conflicts reported in this district.</div>
          )}
        </div>
      </div>

      {/* Attention Families Table for District */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-amber-50">
          <FileWarning className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-amber-800">Families Requiring Attention in {districtId}</h2>
        </div>
        {attentionFamilies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-slate-500 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Family ID</th>
                  <th className="px-6 py-3 font-medium text-center">Open Apps</th>
                  <th className="px-6 py-3 font-medium text-center">Open Conflicts</th>
                  <th className="px-6 py-3 font-medium text-center">Review Benefits</th>
                  <th className="px-6 py-3 font-medium text-center">Total Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attentionFamilies.map(f => (
                  <tr key={f.familyId} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/families/${f.familyId}`)}>
                    <td className="px-6 py-4 font-semibold text-primary hover:underline">{f.familyId}</td>
                    <td className="px-6 py-4 text-center font-medium">{f.openApps > 0 ? <span className="text-amber-600">{f.openApps}</span> : '-'}</td>
                    <td className="px-6 py-4 text-center font-medium">{f.openConfs > 0 ? <span className="text-red-600">{f.openConfs}</span> : '-'}</td>
                    <td className="px-6 py-4 text-center font-medium">{f.reviewBens > 0 ? <span className="text-saffron">{f.reviewBens}</span> : '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">{f.totalIssues}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">No families require immediate attention in this district.</div>
        )}
      </div>
    </div>
  );
}
