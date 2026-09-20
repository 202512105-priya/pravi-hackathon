import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFamilies } from '../data/mockData';
import { getFamilyDetail } from '../data/familyDetailMock';
import { sessionEvents, generateId, assessEventImpact, sessionReviewTasks } from '../data/eventLogic';
import type { FamilyEvent, EventType, EventImpact } from '../data/eventTypes';
import { Badge } from '../components/common/Badge';
import { AlertTriangle, Activity, Baby, Skull, HeartHandshake, Scissors, MapPin, Home, UserCheck, Users, MoveRight } from 'lucide-react';

const EVENT_TYPES: { type: EventType, label: string, icon: any }[] = [
  { type: "BIRTH", label: "Birth", icon: Baby },
  { type: "DEATH", label: "Death", icon: Skull },
  { type: "MARRIAGE", label: "Marriage", icon: HeartHandshake },
  { type: "DIVORCE", label: "Divorce", icon: Scissors },
  { type: "MIGRATION", label: "Migration", icon: MoveRight },
  { type: "ADDRESS_CHANGE", label: "Address Change", icon: MapPin },
  { type: "GUARDIAN_CHANGE", label: "Guardian Change", icon: UserCheck },
  { type: "FAMILY_SPLIT", label: "Family Split", icon: Users },
  { type: "FAMILY_MERGE", label: "Family Merge", icon: Home },
];

export function Events() {
  const navigate = useNavigate();
  
  // Form State
  const [familyId, setFamilyId] = useState('');
  const [eventType, setEventType] = useState<EventType | ''>('');
  const [affectedMemberId, setAffectedMemberId] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [source, setSource] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  
  const [members, setMembers] = useState<{id: string, name: string}[]>([]);
  const [impactSummary, setImpactSummary] = useState<{ event: FamilyEvent, impact: EventImpact } | null>(null);

  // When family changes, load members
  useEffect(() => {
    if (familyId) {
      const family = getFamilyDetail(familyId);
      if (family) {
        setMembers(family.members.map(m => ({ id: m.id, name: m.name })));
      } else {
        setMembers([]);
      }
    } else {
      setMembers([]);
    }
  }, [familyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId || !eventType || !effectiveDate || !source || !reference) return;

    const family = getFamilyDetail(familyId);
    if (!family) return;

    const newEvent: FamilyEvent = {
      id: generateId('EVT'),
      familyId,
      eventType,
      affectedMemberId: affectedMemberId || undefined,
      effectiveDate,
      source,
      supportingReference: reference,
      notes,
      reportedBy: "Current Officer",
      reportedAt: new Date().toISOString(),
      status: "REVIEW_REQUIRED"
    };

    const impact = assessEventImpact(newEvent, family);
    
    // In a real app, save this to DB. Here we mutate session arrays.
    sessionEvents.unshift(newEvent);
    impact.reviewTasks.forEach(t => sessionReviewTasks.push(t));

    setImpactSummary({ event: newEvent, impact });
  };

  const resetForm = () => {
    setFamilyId(''); setEventType(''); setAffectedMemberId('');
    setEffectiveDate(''); setSource(''); setReference(''); setNotes('');
    setImpactSummary(null);
  };

  return (
    <div className="pb-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-1">Family Event Engine</h1>
        <p className="text-slate-500">Report household changes and assess their potential impact on benefits and applications.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <Activity className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <h3 className="font-bold text-blue-800">Events trigger assessment, not automatic decisions.</h3>
          <p className="text-blue-700 text-sm mt-1">
            The system must never automatically cancel, reject, suspend, or transfer a benefit because of an event. Potential impacts will generate Review Tasks for officer investigation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Report Event</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Family ID *</label>
                <select required value={familyId} onChange={e => setFamilyId(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-primary text-sm">
                  <option value="">Select Family...</option>
                  <option value="GJ-F-10293">GJ-F-10293 (Demo)</option>
                  {mockFamilies.map(f => <option key={f.id} value={f.id}>{f.id}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Event Type *</label>
                <select required value={eventType} onChange={e => setEventType(e.target.value as EventType)} className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-primary text-sm">
                  <option value="">Select Event...</option>
                  {EVENT_TYPES.map(e => <option key={e.type} value={e.type}>{e.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Affected Member</label>
                <select value={affectedMemberId} onChange={e => setAffectedMemberId(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-primary text-sm" disabled={!familyId}>
                  <option value="">Whole Family / Not Applicable</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.id})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Effective Date *</label>
                <input required type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-primary text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Source *</label>
                <select required value={source} onChange={e => setSource(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-primary text-sm">
                  <option value="">Select Source...</option>
                  <option value="Officer Report">Officer Report</option>
                  <option value="Civil Registration">Civil Registration</option>
                  <option value="e-Gram">e-Gram</option>
                  <option value="Citizen Report">Citizen Report</option>
                  <option value="PM-FCT">PM-FCT</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Supporting Reference *</label>
                <input required type="text" placeholder="e.g. MIG-2026-001" value={reference} onChange={e => setReference(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-primary text-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-primary text-sm resize-none"></textarea>
            </div>

            <button type="submit" className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-800 transition">
              Report Event
            </button>
          </form>
        </div>

        {/* Impact Summary Section */}
        {impactSummary ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-green-50 border-b border-green-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-800">Event Reported Successfully</h2>
              <button onClick={() => navigate(`/events/${impactSummary.event.id}`)} className="text-sm font-medium text-green-700 hover:underline">
                View Detail →
              </button>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Family</span>
                  <span className="text-slate-800 font-medium">{impactSummary.event.familyId}</span>
                </div>
                <div className="flex-1">
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Event</span>
                  <span className="text-slate-800 font-medium">{EVENT_TYPES.find(e => e.type === impactSummary.event.eventType)?.label}</span>
                </div>
                <div className="flex-1">
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Effective Date</span>
                  <span className="text-slate-800 font-medium">{impactSummary.event.effectiveDate}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4" /> Potential Impact Detected
                </h3>
                <ul className="space-y-2 text-sm text-amber-900 font-medium">
                  <li className="flex justify-between border-b border-amber-200/50 pb-1">
                    <span>Benefits Affected</span>
                    <span>{impactSummary.impact.affectedBenefits.length}</span>
                  </li>
                  <li className="flex justify-between border-b border-amber-200/50 pb-1">
                    <span>Applications Flagged</span>
                    <span>{impactSummary.impact.affectedApplications.length}</span>
                  </li>
                  <li className="flex justify-between font-bold text-red-700">
                    <span>Review Tasks Created</span>
                    <span>{impactSummary.impact.reviewTasks.length}</span>
                  </li>
                </ul>
              </div>

              <button onClick={resetForm} className="mt-auto w-full py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition">
                Report Another Event
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center p-8 text-slate-400">
            <Activity className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-medium text-slate-500">Submit an event to assess impact.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Recent Family Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Family ID</th>
                <th className="px-6 py-4 font-medium">Member</th>
                <th className="px-6 py-4 font-medium">Effective Date</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessionEvents.map(e => {
                const label = EVENT_TYPES.find(t => t.type === e.eventType)?.label || e.eventType;
                return (
                  <tr 
                    key={e.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/events/${e.id}`)}
                  >
                    <td className="px-6 py-4 font-semibold text-primary">{label}</td>
                    <td className="px-6 py-4 text-slate-800">{e.familyId}</td>
                    <td className="px-6 py-4 text-slate-600">{e.affectedMemberId || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{e.effectiveDate}</td>
                    <td className="px-6 py-4 text-slate-600">{e.source}</td>
                    <td className="px-6 py-4">
                      <Badge variant={e.status === 'REVIEW_REQUIRED' ? 'High' : 'Success'}>{e.status.replace('_', ' ')}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
