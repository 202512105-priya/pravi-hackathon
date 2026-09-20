import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';
import { mockApplications, mockTransitions } from '../data/mockData';
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import type { ApplicationStage } from '../data/types';

const STAGES: ApplicationStage[] = [
  "Submitted", 
  "Document Verification", 
  "Department Verification", 
  "Approved", 
  "Payment", 
  "Delivered"
];

const JourneyTimeline = ({ currentStage }: { currentStage: ApplicationStage }) => {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="py-6 px-4">
      <div className="flex flex-col gap-0 relative ml-2">
        {STAGES.map((stage, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          

          return (
            <div key={stage} className="relative flex items-center gap-6 group h-12">
              {/* Vertical line connector */}
              {idx < STAGES.length - 1 && (
                <div className={`absolute left-3 top-6 bottom-[-24px] w-0.5 z-0 ${isPast ? 'bg-green-500' : 'bg-slate-200'}`} />
              )}
              
              {/* Node indicator */}
              <div className="relative z-10 shrink-0">
                {isPast ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 bg-white" />
                ) : isCurrent ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_0_4px_rgba(30,58,138,0.2)]">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-white" />
                )}
              </div>
              
              {/* Text label */}
              <div className="flex items-center gap-3">
                <span className={`font-medium ${isPast ? 'text-slate-700' : isCurrent ? 'text-primary font-bold' : 'text-slate-400'}`}>
                  {stage}
                </span>
                {isCurrent && (
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                    ← CURRENT
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ApplicationDetail() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('Income exceeds the scheme threshold based on recent PDS data.');
  const { hasRole } = useAuth();
  
  // We mock transitions since the backend doesn't serve them exactly yet, 
  // but we can query them later or just use mockTransitions for demo.
  const transitions = mockTransitions.filter(t => t.applicationId === applicationId);

  const loadApp = async () => {
    try {
      // Find app from the full list endpoint
      const apps = await apiClient.get('/applications');
      const found = apps.find((a: any) => a.id === applicationId);
      if (found) {
        // Map backend schema
        setApp({
          id: found.id,
          familyId: found.family_id,
          beneficiaryMemberId: found.beneficiary_member_id,
          schemeName: found.scheme_id, // Simplify for demo
          department: "Department",
          district: "District",
          currentStage: found.current_stage,
          pendingDays: found.pending_days,
          status: found.status
        });
      } else {
        // Fallback to mock data if not in DB
        setApp(mockApplications.find(a => a.id === applicationId));
      }
    } catch {
      setApp(mockApplications.find(a => a.id === applicationId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApp();
  }, [applicationId]);

  const updateStatus = async (newStatus: string) => {
    let reason = '';
    if (newStatus === 'Rejected') {
      const input = prompt("Please enter the reason for rejection:");
      if (input === null) return; // User cancelled prompt
      reason = input;
    }
    try {
      await apiClient.patch(`/applications/${applicationId}/status?status=${encodeURIComponent(newStatus)}`, { status: newStatus, reason });
      setRejectReason(reason);
      loadApp();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  if (!app) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState title="Application Not Found" description="The requested application does not exist." />
      </div>
    );
  }

  return (
    <div className="pb-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <Link to="/applications" className="hover:text-primary transition flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Applications</Link>
          <span>/</span>
          <span className="text-slate-800">{app.id}</span>
        </div>
        <Link to={`/families/${app.familyId}`} className="flex items-center gap-1 text-sm font-semibold text-primary hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
          Family {app.familyId} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{app.schemeName}</h1>
            <p className="text-slate-500">{app.department} • {app.district}</p>
          </div>
          <div className="flex items-center gap-3">
            {app.pendingDays >= 30 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">{app.pendingDays} days pending</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-red-500 text-white px-2 py-0.5 rounded-full">Delayed</span>
              </div>
            )}
            {!hasRole(['AUDITOR']) && app.currentStage !== 'Delivered' && app.currentStage !== 'Rejected' && (
              <div className="flex gap-2 border-l pl-4 ml-2 border-slate-200">
                <button onClick={() => updateStatus('Rejected')} className="px-3 py-2 text-sm font-medium border border-red-200 text-red-700 bg-red-50 rounded hover:bg-red-100 transition">Cancel App</button>
                <button onClick={() => updateStatus('Department Verification')} className="px-3 py-2 text-sm font-medium border border-amber-200 text-amber-700 bg-amber-50 rounded hover:bg-amber-100 transition">Mark Pending</button>
                <button onClick={() => updateStatus('Delivered')} className="px-3 py-2 text-sm font-medium border border-green-200 text-green-700 bg-green-50 rounded hover:bg-green-100 transition">Complete App</button>
              </div>
            )}
          </div>
        </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Application</span>
            <span className="text-slate-800 font-medium">{app.id}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Family</span>
            <Link to={`/families/${app.familyId}`} className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              {app.familyId} 
            </Link>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Member</span>
            <span className="text-slate-800 font-medium">{app.beneficiaryMemberId}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Current Stage</span>
            <span className="text-slate-800 font-medium">{app.currentStage}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Pending</span>
            <span className={`font-medium ${app.pendingDays >= 30 ? 'text-red-600' : 'text-slate-800'}`}>{app.pendingDays} days</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Overall Status</span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${app.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{app.status}</span>
          </div>
          
          {app.currentStage === 'Rejected' && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg col-span-full">
              <h3 className="text-red-800 font-bold mb-1">Rejection Reason</h3>
              <p className="text-sm text-red-700 mb-3">{rejectReason}</p>
              <button className="px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-semibold rounded hover:bg-red-50 transition shadow-sm">
                Initiate Appeal / Challenge
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-4">Application Journey</h2>
          <JourneyTimeline currentStage={app.currentStage} />
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Transition History</h2>
            <p className="text-sm text-slate-500">Audit log of all status changes for this application.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Date/Time</th>
                  <th className="px-6 py-3 font-medium">Officer</th>
                  <th className="px-6 py-3 font-medium">Reason</th>
                  <th className="px-6 py-3 font-medium">From Status</th>
                  <th className="px-6 py-3 font-medium">To Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transitions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{t.timestamp.replace('T', ' ')}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{t.officer}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate" title={t.reason}>{t.reason}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{t.oldStatus}</td>
                    <td className="px-6 py-4 text-primary font-medium text-xs">{t.newStatus}</td>
                  </tr>
                ))}
                {transitions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No transition history available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
