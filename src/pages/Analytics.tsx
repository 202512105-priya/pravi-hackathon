import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, 
  LabelList, LineChart, Line, PieChart, Pie
} from 'recharts';
import { 
  calculateUniqueFamiliesReceivingBenefits, calculateApplicationFunnel, calculatePendingByStage, 
  calculateSchemeVerificationDelay, calculateDistrictMetrics, calculateConflictCategories, 
  calculateFamiliesWithMultipleIssues, calculatePotentialBenefitGaps, calculatePendingTrend 
} from '../data/analyticsLogic';
import { mockApplications } from '../data/mockData';
import { mockConflicts } from '../data/conflictMockData';
import { sessionReviewTasks } from '../data/eventLogic';
import { ArrowRight, Activity, FileWarning, SlidersHorizontal, UserPlus } from 'lucide-react';

export function Analytics() {
  const [incomeLimit, setIncomeLimit] = useState(300000);
  const [selectedScheme, setSelectedScheme] = useState('SCH-HOU-01');
  const schemeMultiplier = selectedScheme === 'SCH-HOU-01' ? 45 : selectedScheme === 'SCH-PDS-01' ? 85 : 20;
  const projectedFamilies = Math.floor((incomeLimit - 200000) / 1000 * schemeMultiplier) + 121;
  const navigate = useNavigate();
  const [scope, setScope] = useState<'State' | 'District'>('State');
  const [selectedDistrict, setSelectedDistrict] = useState('Ahmedabad');

  const districtFilter = scope === 'District' ? selectedDistrict : undefined;

  const kpis = {
    uniqueFamilies: calculateUniqueFamiliesReceivingBenefits(districtFilter),
    totalApps: mockApplications.filter(a => !districtFilter || a.district === districtFilter).length,
    pendingApps: calculatePendingByStage(districtFilter).reduce((sum, s) => sum + s.count, 0),
    approvedApps: mockApplications.filter(a => a.currentStage === 'Approved' && (!districtFilter || a.district === districtFilter)).length,
    rejectedApps: mockApplications.filter(a => a.currentStage === 'Rejected' && (!districtFilter || a.district === districtFilter)).length,
    openReviews: sessionReviewTasks.filter(r => r.status === 'Review Required' && (!districtFilter || true)).length, // Simplified scope
    dataConflicts: mockConflicts.filter(c => c.status === 'OPEN' && (!districtFilter || c.district === districtFilter)).length,
    benefitGaps: calculatePotentialBenefitGaps(districtFilter).length
  };

  const funnelData = calculateApplicationFunnel(districtFilter);
  const bottlenecks = calculatePendingByStage(districtFilter);
  const schemeDelays = calculateSchemeVerificationDelay(districtFilter);
  const conflictCategories = calculateConflictCategories(districtFilter);
  const attentionFamilies = calculateFamiliesWithMultipleIssues(districtFilter).slice(0, 5);
  const districtMetrics = calculateDistrictMetrics();
  const trendData = calculatePendingTrend(districtFilter);

  const [compareMetric, setCompareMetric] = useState<keyof typeof districtMetrics[0]>('familiesReceivingBenefits');

  return (
    <div className="pb-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Family ID 360 Analytics</h1>
          <p className="text-slate-500">How many families are being served, where are journeys getting stuck?</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-amber-200">
            <Activity className="w-3 h-3" /> Synthetic demo analytics — based on mock records
          </span>
          <div className="flex gap-2">
            <select value={scope} onChange={e => setScope(e.target.value as any)} className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary bg-white">
              <option value="State">Statewide</option>
              <option value="District">District Specific</option>
            </select>
            {scope === 'District' && (
              <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary bg-white">
                {districtMetrics.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div onClick={() => navigate('/benefits')} className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary transition group">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1 flex items-center justify-between">
            Unique Families Served <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
          </div>
          <div className="text-3xl font-bold text-primary">{kpis.uniqueFamilies}</div>
        </div>
        <div onClick={() => navigate('/applications')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary transition group">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Total Apps</div>
          <div className="text-xl font-bold text-slate-800">{kpis.totalApps}</div>
        </div>
        <div onClick={() => navigate('/applications?status=pending')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary transition group">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Pending</div>
          <div className="text-xl font-bold text-saffron">{kpis.pendingApps}</div>
        </div>
        <div onClick={() => navigate('/applications?stage=Approved')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary transition group">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Approved</div>
          <div className="text-xl font-bold text-green-600">{kpis.approvedApps}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary transition group">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Open Reviews</div>
          <div className="text-xl font-bold text-slate-800">{kpis.openReviews}</div>
        </div>
        <div onClick={() => navigate('/conflicts')} className="bg-white p-4 rounded-xl shadow-sm border border-red-200 cursor-pointer hover:border-red-500 transition group bg-red-50/30">
          <div className="text-red-700 text-[10px] font-bold uppercase tracking-wide mb-1">Conflicts</div>
          <div className="text-xl font-bold text-red-700">{kpis.dataConflicts}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 cursor-pointer hover:border-amber-500 transition group bg-amber-50/30">
          <div className="text-amber-700 text-[10px] font-bold uppercase tracking-wide mb-1">Benefit Gaps</div>
          <div className="text-xl font-bold text-amber-700">{kpis.benefitGaps}</div>
        </div>
      </div>

      
      {/* What-If Policy Simulator */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Policy Simulator ("What-If" Tool)</h2>
              <p className="text-sm text-slate-500">Test policy changes and instantly generate outreach tasks.</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div className="col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Scheme</label>
              <select value={selectedScheme} onChange={e => setSelectedScheme(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="SCH-HOU-01">Housing Upgrade Grant (Housing)</option>
                <option value="SCH-PDS-01">Antyodaya Anna Yojana (PDS)</option>
                <option value="SCH-EDU-01">Higher Education Scholarship (Education)</option>
                <option value="SCH-WCD-01">Maternal Health Support (WCD)</option>
              </select>
            </div>
            <div>
              <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                <span>Simulated Income Limit (₹)</span>
                <span className="text-indigo-700">₹{(incomeLimit).toLocaleString()} (Simulated)</span>
              </label>
              <input type="range" min="200000" max="500000" step="10000" value={incomeLimit} onChange={(e) => setIncomeLimit(Number(e.target.value))} className="w-full accent-indigo-600" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Current: ₹2,00,000</span>
                <span>Max: ₹5,00,000</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm text-center">
            <UserPlus className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <h3 className="text-3xl font-black text-slate-800">{projectedFamilies.toLocaleString()}</h3>
            <p className="text-sm font-medium text-slate-500 mb-4">Newly Eligible Families</p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition shadow-sm">
              Create Outreach Tasks
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Application Funnel</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} onClick={() => navigate(`/applications`)} className="cursor-pointer">
                  {funnelData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index > 2 ? (index > 4 ? '#10b981' : '#3b82f6') : '#94a3b8'} />
                  ))}
                  <LabelList dataKey="count" position="right" fill="#64748b" fontSize={12} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottlenecks */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Where are applications getting stuck?</h2>
          <div className="space-y-4">
            {bottlenecks.map(b => (
              <div key={b.stage} className="border border-slate-100 bg-slate-50 rounded-lg p-4 cursor-pointer hover:border-primary transition" onClick={() => navigate('/applications')}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-800">{b.stage}</span>
                  <span className="text-primary font-bold">{b.count} pending</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-slate-600">Average: <span className="font-semibold">{b.avgDays} days</span></span>
                  <span className="text-red-600">Longest: <span className="font-semibold">{b.maxDays} days</span></span>
                  <span className="text-amber-600 font-medium bg-amber-100 px-2 py-0.5 rounded">{b.delayedCount} apps {'>'}30 days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheme Delays */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Highest Verification Delays</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schemeDelays.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="schemeName" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={110} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(val) => [`${val} days avg`, 'Delay']} />
                <Bar dataKey="avgDelay" radius={[0, 4, 4, 0]} fill="#f59e0b" onClick={() => navigate('/applications')} className="cursor-pointer">
                  <LabelList dataKey="avgDelay" position="right" fill="#64748b" fontSize={11} formatter={(v:any) => `${v}d`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Comparison */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">District Comparison</h2>
            <select value={compareMetric} onChange={e => setCompareMetric(e.target.value as any)} className="border border-slate-200 rounded px-2 py-1 text-sm outline-none">
              <option value="familiesReceivingBenefits">Families Receiving Benefits</option>
              <option value="activeApplications">Active Applications</option>
              <option value="pendingApplications">Pending Applications</option>
              <option value="openConflicts">Open Conflicts</option>
            </select>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtMetrics} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="district" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey={compareMetric} radius={[4, 4, 0, 0]} fill="#3b82f6" onClick={(data: any) => navigate(`/analytics/districts/${data.district}`)} className="cursor-pointer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Conflicts */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex justify-between">
            Data Conflict Overview
            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">{kpis.dataConflicts} Open</span>
          </h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={conflictCategories} 
                  dataKey="count" 
                  nameKey="name" 
                  cx="50%" cy="50%" 
                  outerRadius={80} 
                  label={(entry: any) => `${entry.name} (${entry.count})`}
                  labelLine={false}
                  onClick={(data) => navigate(`/conflicts?type=${data.payload.originalType}`)}
                  className="cursor-pointer"
                >
                  {conflictCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#06b6d4'][index % 5]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Trend */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Average Pending Days Trend</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(val) => [`${val} days`, 'Avg Pending']} />
                <Line type="monotone" dataKey="averageDays" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attention Families Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-amber-50">
          <FileWarning className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-amber-800">Households Requiring Attention</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Family ID</th>
                <th className="px-6 py-3 font-medium">District</th>
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
                  <td className="px-6 py-4 text-slate-600">{f.district}</td>
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
      </div>

      {/* Benefit Gaps Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Potential Benefit Delivery Gaps</h2>
          <span className="text-xs font-medium text-slate-500">Deterministic gap rules flagged {kpis.benefitGaps} families</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Family ID</th>
                <th className="px-6 py-3 font-medium">Member</th>
                <th className="px-6 py-3 font-medium">Potential Scheme</th>
                <th className="px-6 py-3 font-medium">Department</th>
                <th className="px-6 py-3 font-medium">Reason</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calculatePotentialBenefitGaps(districtFilter).map((gap, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-primary cursor-pointer hover:underline" onClick={() => navigate(`/families/${gap.familyId}`)}>{gap.familyId}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{gap.memberName} ({gap.memberId})</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{gap.schemeName}</td>
                  <td className="px-6 py-4 text-slate-600">{gap.department}</td>
                  <td className="px-6 py-4 text-amber-700 font-medium text-xs max-w-xs">{gap.reason}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => navigate(`/families/${gap.familyId}`)} className="text-xs font-bold text-primary bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition">
                      Review Family
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
