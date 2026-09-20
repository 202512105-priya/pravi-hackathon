import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { apiClient } from '../api/client';
import { AlertCircle } from 'lucide-react';
import type { ApplicationStage } from '../data/types';

const STAGES: ApplicationStage[] = [
  "Submitted", 
  "Document Verification", 
  "Department Verification", 
  "Approved", 
  "Payment", 
  "Delivered"
];

export function Applications() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient.get('/applications');
        // enrich manually for demo
        const enriched = data.map((a: any) => ({
          ...a,
          applicantName: a.beneficiary_member_id,
          schemeName: a.scheme_id,
          department: "Assorted",
          pendingDays: a.pending_days,
          currentStage: a.current_stage
        }));
        setApplications(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-slate-500">Loading live applications...</div>;

  const enrichedApplications = applications;

  const filtered = enrichedApplications.filter(a => {
    if (filterStage !== 'All' && a.currentStage !== filterStage) return false;
    if (filterDept !== 'All' && a.department !== filterDept) return false;
    
    const searchLower = searchTerm.toLowerCase();
    if (searchLower && !(
      a.id.toLowerCase().includes(searchLower) ||
      a.familyId.toLowerCase().includes(searchLower) ||
      a.beneficiaryMemberId.toLowerCase().includes(searchLower) ||
      a.enrichedApplicantName.toLowerCase().includes(searchLower) ||
      a.schemeName.toLowerCase().includes(searchLower)
    )) return false;
    
    return true;
  });

  // KPI Calculations
  const counts = {
    total: applications.length,
    submitted: applications.filter(a => a.currentStage === 'Submitted').length,
    docVerif: applications.filter(a => a.currentStage === 'Document Verification').length,
    deptVerif: applications.filter(a => a.currentStage === 'Department Verification').length,
    approved: applications.filter(a => a.currentStage === 'Approved').length,
    payment: applications.filter(a => a.currentStage === 'Payment').length,
    delivered: applications.filter(a => a.currentStage === 'Delivered').length,
    rejected: 0 // Mock dataset currently has no explicit rejected status on stage, but we include it.
  };

  const statusDistributionData = [
    { name: 'Submitted', count: counts.submitted },
    { name: 'Document Verif.', count: counts.docVerif },
    { name: 'Dept Verif.', count: counts.deptVerif },
    { name: 'Approved', count: counts.approved },
    { name: 'Payment', count: counts.payment },
    { name: 'Delivered', count: counts.delivered },
  ];

  // Department-wise grouping
  const departments = Array.from(new Set(applications.map(a => a.department)));
  const deptChartData = departments.map(dept => {
    const apps = applications.filter(a => a.department === dept);
    return {
      department: dept,
      Pending: apps.filter(a => ['Submitted', 'Document Verification', 'Department Verification', 'Payment'].includes(a.currentStage)).length,
      Approved: apps.filter(a => a.currentStage === 'Approved').length,
      Delivered: apps.filter(a => a.currentStage === 'Delivered').length,
      Rejected: 0
    };
  });

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    navigate(path);
  };

  return (
    <div className="pb-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-1">Application Journey</h1>
        <p className="text-slate-500">Overview of all applications, their current stages, and department bottlenecks.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Total</div>
          <div className="text-xl font-bold text-slate-800">{counts.total}</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary" onClick={() => setFilterStage('Submitted')}>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Submitted</div>
          <div className="text-xl font-bold text-slate-800">{counts.submitted}</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary" onClick={() => setFilterStage('Document Verification')}>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Doc Verif</div>
          <div className="text-xl font-bold text-slate-800">{counts.docVerif}</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary" onClick={() => setFilterStage('Department Verification')}>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Dept Verif</div>
          <div className="text-xl font-bold text-slate-800">{counts.deptVerif}</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary" onClick={() => setFilterStage('Approved')}>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Approved</div>
          <div className="text-xl font-bold text-green-600">{counts.approved}</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary" onClick={() => setFilterStage('Payment')}>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Payment</div>
          <div className="text-xl font-bold text-slate-800">{counts.payment}</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-primary" onClick={() => setFilterStage('Delivered')}>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Delivered</div>
          <div className="text-xl font-bold text-primary">{counts.delivered}</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1">Rejected</div>
          <div className="text-xl font-bold text-red-600">{counts.rejected}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Application Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  onClick={(data) => {
                    const fullStageName = STAGES.find(s => s.startsWith((data.name || "").replace('.', '')));
                    if (fullStageName) setFilterStage(fullStageName);
                  }}
                  className="cursor-pointer"
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Approved' || entry.name === 'Delivered' ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Department-wise Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="department" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Pending" stackId="a" fill="#fbbf24" radius={[4, 0, 0, 4]} />
                <Bar dataKey="Approved" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Delivered" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Rejected" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-2 items-center">
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-primary">
            <option value="All">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-primary">
            <option value="All">All Stages</option>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => { setFilterStage('All'); setFilterDept('All'); setSearchTerm(''); }} className="text-xs text-primary font-medium hover:underline px-2">Clear Filters</button>
          
          <input 
            type="text" 
            placeholder="Search Scheme, Family, Applicant..." 
            className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-primary ml-auto min-w-[280px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">App ID</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Family ID</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Member ID</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Applicant</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Scheme</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Department</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Stage</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Pending Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(a => (
                  <tr 
                    key={a.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    onClick={() => navigate(`/applications/${a.id}`)}
                  >
                    <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">{a.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button onClick={(e) => handleLinkClick(e, `/families/${a.familyId}`)} className="text-primary hover:underline hover:text-blue-800">{a.familyId}</button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button onClick={(e) => handleLinkClick(e, `/families/${a.familyId}`)} className="text-primary hover:underline hover:text-blue-800">{a.beneficiaryMemberId}</button>
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium whitespace-nowrap">{a.enrichedApplicantName}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{a.schemeName}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{a.department}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{a.currentStage}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {a.pendingDays >= 30 ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-red-600">{a.pendingDays} days</span>
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-red-500 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" /> Delayed
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600">{a.pendingDays} days</span>
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
