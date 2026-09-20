import { useParams, Link } from 'react-router-dom';
import { sessionEvents, sessionReviewTasks, assessEventImpact } from '../data/eventLogic';
import { getFamilyDetail } from '../data/familyDetailMock';
import { Badge } from '../components/common/Badge';
import { ArrowLeft, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import React from 'react';

export function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = sessionEvents.find(e => e.id === eventId);

  if (!event) {
    return <div className="p-8 text-center text-slate-500">Event not found.</div>;
  }

  const family = getFamilyDetail(event.familyId);
  const impact = family ? assessEventImpact(event, family) : null;
  const tasks = sessionReviewTasks.filter(t => t.eventId === event.id);

  const formatLabel = (type: string) => type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

  return (
    <div className="pb-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <Link to="/events" className="hover:text-primary transition flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Family Events</Link>
          <span>/</span>
          <span className="text-slate-800">{event.id}</span>
        </div>
        <Link to={`/families/${event.familyId}`} className="flex items-center gap-1 text-sm font-semibold text-primary hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
          Family {event.familyId} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{formatLabel(event.eventType)}</h1>
            <p className="text-slate-500 text-sm">Reported on {event.reportedAt.split('T')[0]} by {event.reportedBy}</p>
          </div>
          <Badge variant={event.status === 'REVIEW_REQUIRED' ? 'High' : 'Success'}>{event.status.replace('_', ' ')}</Badge>
        </div>
        
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Affected Member</span>
            <span className="text-slate-800 font-medium">{event.affectedMemberId || 'Entire Household'}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Effective Date</span>
            <span className="text-slate-800 font-medium">{event.effectiveDate}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Source</span>
            <span className="text-slate-800 font-medium">{event.source}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Reference</span>
            <span className="text-slate-800 font-medium">{event.supportingReference}</span>
          </div>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Processing Timeline</h2>
        <div className="flex items-center w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          {['Event Reported', 'Impact Assessment', 'Records Flagged', 'Tasks Created'].map((step, idx) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2 relative z-10">
                <CheckCircle2 className="w-8 h-8 text-green-500 bg-white rounded-full" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide text-center w-24">{step}</span>
              </div>
              {idx < 3 && <div className="flex-1 h-1 bg-green-500 -mx-4 z-0 rounded" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {impact && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-2 items-center">
              <ShieldAlert className="w-5 h-5 text-saffron" />
              <h2 className="text-lg font-semibold text-slate-800">Affected Benefits ({impact.affectedBenefits.length})</h2>
            </div>
            {impact.affectedBenefits.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Scheme</th>
                    <th className="px-6 py-3 font-medium">Department</th>
                    <th className="px-6 py-3 font-medium">Reason Flagged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {impact.affectedBenefits.map((b, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-primary">
                        <Link to={`/benefits/${b.benefit.id}`} className="hover:underline">{b.benefit.schemeName}</Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{b.benefit.department}</td>
                      <td className="px-6 py-4 text-red-600 font-medium">{b.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-slate-500">No benefits directly affected by this event.</div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-2 items-center">
              <ShieldAlert className="w-5 h-5 text-saffron" />
              <h2 className="text-lg font-semibold text-slate-800">Affected Applications ({impact.affectedApplications.length})</h2>
            </div>
            {impact.affectedApplications.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Application</th>
                    <th className="px-6 py-3 font-medium">Stage</th>
                    <th className="px-6 py-3 font-medium">Reason Flagged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {impact.affectedApplications.map((a, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-primary">
                        <Link to={`/applications/${a.app.id}`} className="hover:underline">{a.app.schemeName} ({a.app.id})</Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{a.app.currentStage}</td>
                      <td className="px-6 py-4 text-red-600 font-medium">{a.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-slate-500">No pending applications affected.</div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Review Required Tasks ({tasks.length})</h2>
            </div>
            {tasks.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Task ID</th>
                    <th className="px-6 py-3 font-medium">Department</th>
                    <th className="px-6 py-3 font-medium">Reason</th>
                    <th className="px-6 py-3 font-medium">Assigned Officer</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-4 font-medium text-slate-800">{t.id}</td>
                      <td className="px-6 py-4 text-slate-600">{t.department}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{t.reason}</td>
                      <td className="px-6 py-4 text-slate-500">{t.assignedOfficer}</td>
                      <td className="px-6 py-4">
                        <Badge variant={t.status === 'Review Required' ? 'High' : 'Neutral'}>{t.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-slate-500">No review tasks generated.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
