import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockConflicts } from '../data/conflictMockData';
import { Badge } from '../components/common/Badge';

export function Conflicts() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('All');
  const [filterConfidence, setFilterConfidence] = useState('All');
  const [filterStatus, setFilterStatus] = useState('OPEN');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockConflicts.filter(c => {
    if (filterType !== 'All' && c.type !== filterType) return false;
    if (filterConfidence !== 'All' && c.confidence !== filterConfidence) return false;
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (searchTerm && !c.familyId.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return 'Low';
      case 'UNDER_REVIEW': return 'Medium';
      case 'VERIFIED': return 'Success';
      case 'RESOLVED': return 'Success';
      case 'UNRESOLVED': return 'High';
      default: return 'Neutral';
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    if (confidence === 'HIGH') return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">High</span>;
    if (confidence === 'MEDIUM') return <span className="bg-saffron/20 text-saffron px-2 py-1 rounded text-xs font-bold">Medium</span>;
    return <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">Low</span>;
  };

  const formatType = (type: string) => {
    return type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="pb-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-1">Data Quality & Conflict Resolution</h1>
        <p className="text-slate-500">Review conflicting records across connected government systems and resolve them through explicit officer verification.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium mb-1">Open Conflicts</div>
          <div className="text-2xl font-bold text-slate-800">{mockConflicts.filter(c => c.status === 'OPEN').length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium mb-1">High Confidence Matches</div>
          <div className="text-2xl font-bold text-slate-800">{mockConflicts.filter(c => c.confidence === 'HIGH' && c.status === 'OPEN').length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium mb-1">Pending Review</div>
          <div className="text-2xl font-bold text-slate-800">{mockConflicts.filter(c => c.status === 'UNDER_REVIEW').length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium mb-1">Resolved Today</div>
          <div className="text-2xl font-bold text-green-600">0</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-2 overflow-x-auto">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-primary">
            <option value="All">All Types</option>
            <option value="NAME_MISMATCH">Name Mismatch</option>
            <option value="DOB_MISMATCH">DOB Mismatch</option>
            <option value="ADDRESS_MISMATCH">Address Mismatch</option>
            <option value="DUPLICATE_MEMBER">Duplicate Member</option>
            <option value="RELATIONSHIP_MISMATCH">Relationship Mismatch</option>
          </select>
          <select value={filterConfidence} onChange={e => setFilterConfidence(e.target.value)} className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-primary">
            <option value="All">All Confidences</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-primary">
            <option value="All">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="VERIFIED">Verified</option>
            <option value="RESOLVED">Resolved</option>
            <option value="UNRESOLVED">Unresolved</option>
          </select>
          <input 
            type="text" 
            placeholder="Search Family ID..." 
            className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-primary ml-auto"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No conflicts found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Conflict ID</th>
                  <th className="px-6 py-4 font-medium">Family ID</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Confidence</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => (
                  <tr 
                    key={c.id} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/conflicts/${c.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-primary">{c.id}</td>
                    <td className="px-6 py-4 text-slate-600">{c.familyId}</td>
                    <td className="px-6 py-4 text-slate-800">{formatType(c.type)}</td>
                    <td className="px-6 py-4">{getConfidenceBadge(c.confidence)}</td>
                    <td className="px-6 py-4 font-mono">{c.matchScore}/100</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(c.status)}>{c.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{c.createdAt.split('T')[0]}</td>
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
