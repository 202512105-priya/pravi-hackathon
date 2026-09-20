import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockConflicts, mockConflictAudits } from '../data/conflictMockData';
import { Badge } from '../components/common/Badge';
import { ArrowLeft, ArrowRight, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export function ConflictDetail() {
  const { conflictId } = useParams<{ conflictId: string }>();
  const conflict = mockConflicts.find(c => c.id === conflictId);
  const audits = mockConflictAudits.filter(a => a.conflictId === conflictId);
  
  const [selectedSource, setSelectedSource] = useState('');

  if (!conflict) {
    return <div className="p-8 text-center">Conflict not found.</div>;
  }

  const formatType = (type: string) => type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

  return (
    <div className="pb-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <Link to="/conflicts" className="hover:text-primary transition flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Conflicts</Link>
          <span>/</span>
          <span className="text-slate-800">{conflict.id}</span>
        </div>
        <Link to={`/families/${conflict.familyId}`} className="flex items-center gap-1 text-sm font-semibold text-primary hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
          Family {conflict.familyId} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
        <div>
          <h3 className="font-bold text-red-800">Potential match only. No records have been automatically merged.</h3>
          <p className="text-red-700 text-sm mt-1">
            Officer verification is required before any source-of-record decision. The system has identified this as a potential conflict, but does not alter the underlying authoritative databases.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Conflict #{conflict.id}</h1>
            <p className="text-slate-600 text-lg">{formatType(conflict.type)}</p>
          </div>
          <Badge variant={conflict.status === 'OPEN' ? 'Low' : 'Success'}>{conflict.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-800">Side-by-side Source Records</h2>
          </div>
          <div className="p-4 flex-1 overflow-x-auto">
            {conflict.records.length > 0 ? (
              <div className="flex gap-4">
                {conflict.records.map((r, i) => (
                  <div key={i} className="flex-1 min-w-[250px] border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 p-3 border-b border-slate-200 flex justify-between items-center">
                      <h3 className="font-semibold text-slate-800">{r.system}</h3>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        Rel: {(r.reliability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="p-4 bg-white space-y-3 text-sm">
                      {Object.entries(r.data).map(([key, val]) => {
                        // Very naive conflict highlighter for demo: if another record has a different value for the same key, it's a conflict
                        const hasConflict = conflict.records.some(other => other.data[key] && other.data[key] !== val);
                        return (
                          <div key={key}>
                            <span className="block text-xs font-semibold text-slate-500 uppercase">{key}</span>
                            <span className={`block font-medium ${hasConflict ? 'text-red-600 bg-red-50 px-1 -mx-1 rounded' : 'text-slate-800'}`}>
                              {val} {hasConflict && <span className="text-red-500 ml-1 text-xs font-bold">← CONFLICT</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 text-center">
                      Last Sync: {r.lastSync}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-center py-8">No specific source records loaded for this conflict.</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800">Match Score</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-primary">{conflict.matchScore} <span className="text-lg text-slate-400 font-normal">/ 100</span></span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  conflict.confidence === 'HIGH' ? 'bg-red-100 text-red-700' :
                  conflict.confidence === 'MEDIUM' ? 'bg-saffron/20 text-saffron' : 'bg-slate-100 text-slate-700'
                }`}>{conflict.confidence} Confidence</span>
              </div>
              
              <div className="space-y-3 text-sm">
                {Object.entries(conflict.factors).map(([key, factor]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  return (
                    <div key={key} className="group relative">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-600 flex items-center gap-1">
                          {label}
                          <HelpCircle className="w-3 h-3 text-slate-400 cursor-help" />
                        </span>
                        <span className="font-medium text-slate-800">{factor.score}/{factor.max}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${(factor.score / factor.max) * 100}%` }} />
                      </div>
                      {/* Tooltip */}
                      <div className="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-slate-800 text-white text-xs p-2 rounded shadow-lg">
                        {factor.reason}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-slate-800">Officer Action</h2>
            </div>
            <div className="p-4 space-y-4 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Select Preferred Source</label>
                <select 
                  value={selectedSource} 
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-primary text-sm"
                >
                  <option value="">-- Choose one --</option>
                  {conflict.records.map(r => <option key={r.system} value={r.system}>{r.system}</option>)}
                </select>
                <button 
                  disabled={!selectedSource}
                  className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-800 transition"
                >
                  Mark Verified with Preferred Source
                </button>
              </div>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-slate-400">OR</span></div>
              </div>
              
              <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition">
                Request Field Review
              </button>
              <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition">
                Leave Unresolved
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Audit Trail</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Date/Time</th>
                <th className="px-6 py-3 font-medium">Officer</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Previous</th>
                <th className="px-6 py-3 font-medium">New Status</th>
                <th className="px-6 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audits.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{a.timestamp.replace('T', ' ')}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{a.officer}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{a.action}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{a.previousStatus}</td>
                  <td className="px-6 py-4 text-primary font-medium text-xs">{a.newStatus}</td>
                  <td className="px-6 py-4 text-slate-600">{a.reason}</td>
                </tr>
              ))}
              {audits.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No audit history found for this conflict.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
