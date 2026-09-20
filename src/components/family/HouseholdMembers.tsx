import { Card } from '../common/Card';
import type { DetailedFamily } from "../../data/familyDetailMock";
import { Badge } from '../common/Badge';
import { CheckCircle2, User, AlertOctagon } from 'lucide-react';
import { sessionEvents } from '../../data/eventLogic';

export function HouseholdMembers({ family }: { family: DetailedFamily }) {
  const familySessionEvents = sessionEvents.filter(e => e.familyId === family.id && e.status === 'REVIEW_REQUIRED');

  return (
    <Card className="flex flex-col mb-6">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Household Members</h3>
        {familySessionEvents.length > 0 && (
          <span className="flex items-center gap-1 text-red-600 text-sm font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <AlertOctagon className="w-4 h-4" /> {familySessionEvents.length} Pending Event(s)
          </span>
        )}
      </div>
      
      <div className="p-6 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <h4 className="text-sm font-medium text-slate-500 mb-4 text-center">Relationship Structure</h4>
        <div className="flex justify-center items-center min-w-max">
          <div className="flex flex-col items-center">
            {/* Head */}
            {(() => {
              const head = family.members.find(m => m.relation === 'Head') || family.members[0];
              const others = family.members.filter(m => m.id !== head?.id);
              
              if (!head) return null;

              return (
                <>
                  <div className="bg-white border-2 border-primary rounded-lg px-4 py-2 text-center shadow-sm z-10 w-40">
                    <span className="block text-xs font-semibold text-primary uppercase tracking-wide mb-1">{head.relation}</span>
                    <span className="font-medium text-slate-800 text-sm truncate block">{head.name}</span>
                  </div>
                  
                  {others.length > 0 && (
                    <>
                      {/* Vertical Line from Head */}
                      <div className="h-6 w-0.5 bg-slate-300"></div>
                      
                      {/* Horizontal Line spanning children */}
                      <div className="relative bg-slate-300 h-0.5" style={{ width: `${Math.max((others.length - 1) * 160, 2)}px` }}>
                        {others.map((_, idx) => (
                          <div key={idx} className="absolute -top-0.5 h-6 w-0.5 bg-slate-300" style={{ left: others.length === 1 ? '50%' : `${(idx / (others.length - 1)) * 100}%` }}></div>
                        ))}
                      </div>
                      
                      {/* Others row */}
                      <div className="flex justify-between mt-5" style={{ width: `${Math.max((others.length - 1) * 160 + 120, 120)}px` }}>
                        {others.map((member) => (
                          <div key={member.id} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-center shadow-sm w-28 flex flex-col items-center">
                            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 truncate w-full">{member.relation}</span>
                            <span className="font-medium text-slate-700 text-xs truncate w-full" title={member.name}>{member.name.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Age/Gender</th>
              <th className="px-5 py-3 font-medium">Relation</th>
              <th className="px-5 py-3 font-medium">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {family.members.map((m) => {
              const pendingEvents = familySessionEvents.filter(e => e.affectedMemberId === m.id || !e.affectedMemberId);
              const hasEvent = pendingEvents.length > 0;
              
              return (
                <tr key={m.id} className={`hover:bg-slate-50 ${hasEvent ? 'bg-amber-50/50' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 flex items-center gap-2">
                          {m.name}
                          {hasEvent && (
                            <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded font-bold tracking-wide uppercase shadow-sm">
                              {pendingEvents[0].eventType.replace('_', ' ')} Flagged
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{m.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{m.age} • {m.gender}</td>
                  <td className="px-5 py-3">
                    <Badge variant={m.relation === 'Head' ? 'Low' : 'Neutral'}>{m.relation}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Verified
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
