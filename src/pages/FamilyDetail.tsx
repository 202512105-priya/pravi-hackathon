import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ShieldAlert, Users, AlertTriangle, FileText, Activity } from 'lucide-react';
import { HouseholdMembers } from '../components/family/HouseholdMembers';
import { EventTimeline } from '../components/family/EventTimeline';
import { apiClient } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { getFamilyDetail } from '../data/familyDetailMock';
import type { DetailedFamily } from '../data/familyDetailMock';

export function FamilyDetail({ overrideFamilyId }: { overrideFamilyId?: string }) {
  const { hasRole } = useAuth();
  const { familyId: routeFamilyId } = useParams<{ familyId: string }>();
  const familyId = overrideFamilyId || routeFamilyId;
  
  const [family, setFamily] = useState<DetailedFamily | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFamily() {
      if (!familyId) return;
      try {
        const data = await apiClient.get(`/families/${familyId}`);
        
        const fallback = getFamilyDetail(familyId);
        
                const appsData = await apiClient.get(`/families/${familyId}/applications`);
        
        // Merge Backend Data into the detailed mock structure
        if (fallback) {
            fallback.id = data.id;
            fallback.headName = data.head_name;
            fallback.district = data.district;
            fallback.taluka = data.taluka;
            fallback.village = data.village;
            fallback.applications = appsData.map((a: any) => ({
              id: a.id,
              familyId: a.family_id,
              beneficiaryMemberId: a.beneficiary_member_id,
              schemeName: a.scheme_id, // Simplify
              currentStage: a.current_stage,
              status: a.status,
              pendingDays: a.pending_days,
              submittedAt: a.submitted_at
            }));
            fallback.rationCardStatus = data.ration_card_status || 'Active';
            fallback.members = data.members.map((m: any) => ({
                id: m.id,
                name: m.name,
                age: m.age,
                gender: m.gender,
                relation: m.relation,
                aadhaarRef: m.aadhaar_ref
            }));
            setFamily({ ...fallback });
        } else {
            setFamily(null);
        }
      } catch (err) {
        console.error("Backend fetch failed, falling back to mock generator", err);
        setFamily(getFamilyDetail(familyId));
      } finally {
        setLoading(false);
      }
    }
    loadFamily();
  }, [familyId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading family from backend...</div>;
  }

  if (!family) {
    return <div className="p-8 text-center text-slate-500">Family not found.</div>;
  }

  return (
    <div className="pb-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center text-sm text-slate-500 font-medium">
        <Link to="/families" className="hover:text-primary transition">Families</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{family.id}</span>
      </div>

      <FamilyHeader family={family} canEdit={!hasRole(['AUDITOR', 'CITIZEN'])} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <HouseholdMembers family={family} />
          <BenefitLedger family={family} />
          <ApplicationsSummary family={family} />
        </div>
        
        <div className="space-y-6">
          <AttentionRequired family={family} canEdit={!hasRole(['AUDITOR', 'CITIZEN'])} />
          <EventTimeline family={family} />
        </div>
      </div>
    </div>
  );
}

function FamilyHeader({ family, canEdit = true }: { family: DetailedFamily, canEdit?: boolean }) {
  return (
    <Card className="mb-6 border-l-4 border-l-primary">
      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-800">{family.id}</h1>
            <Badge variant={family.householdStatus === 'Active' ? 'Success' : 'Low'}>
              {family.householdStatus || 'Active'} Household
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> {family.members.length} Members</span>
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> Ration Card: {family.rationCardStatus}</span>
            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-slate-400" /> Last Verified: {family.lastVerified}</span>
          </div>
        </div>
        {canEdit && (<div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition text-sm">
            Create Review Task
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg font-medium transition text-sm">
            Report Event
          </button>
        </div>)}
      </div>
    </Card>
  );
}

function BenefitLedger({ family }: { family: DetailedFamily }) {
  return (
    <Card className="flex flex-col">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Benefit Ledger</h3>
        <Link to="/benefits" className="text-sm font-medium text-primary hover:underline">View All</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 font-medium">Scheme</th>
              <th className="px-5 py-3 font-medium">Beneficiary Member ID</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Paid (Sent)</th>
              <th className="px-5 py-3 font-medium">Received</th>
              <th className="px-5 py-3 font-medium">Alert</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {family.benefits.map((b, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-800">{b.schemeName}</td>
                <td className="px-5 py-3 text-slate-600">{b.beneficiaryMemberId}</td>
                <td className="px-5 py-3"><Badge variant={b.status === 'Disbursed' ? 'Success' : 'High'}>{b.status === 'Disbursed' ? 'Received' : 'Sent, Not Received'}</Badge></td>
                <td className="px-5 py-3 font-medium text-slate-700">₹15,000</td>
                <td className="px-5 py-3 font-medium text-slate-700">{b.status === 'Disbursed' ? '₹15,000' : '₹0'}</td>
                <td className="px-5 py-3">
                  {b.status !== 'Disbursed' && <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold hover:bg-red-200">Fix Payment</button>}
                </td>
              </tr>
            ))}
            {family.benefits.length === 0 && (
              <tr><td colSpan={4} className="p-5 text-center text-slate-500">No active benefits.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ApplicationsSummary({ family }: { family: DetailedFamily }) {
  return (
    <Card className="flex flex-col">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Pending Applications</h3>
        <Link to="/applications" className="text-sm font-medium text-primary hover:underline">View Funnel</Link>
      </div>
      <div className="divide-y divide-slate-100">
        {family.applications.filter(a => a.currentStage !== 'Delivered' && a.currentStage !== 'Rejected').map((app, i) => (
          <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">{app.schemeName}</h4>
              <div className="text-xs text-slate-500">Applicant: {app.beneficiaryMemberId} • Filed: {app.submittedAt}</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-saffron mb-1">{app.currentStage}</span>
              <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">{app.pendingDays} Days</span>
            </div>
          </div>
        ))}
        {family.applications.filter(a => a.currentStage !== 'Delivered' && a.currentStage !== 'Rejected').length === 0 && (
          <div className="p-5 text-center text-slate-500">No pending applications.</div>
        )}
      </div>
    </Card>
  );
}

function AttentionRequired({ family, canEdit = true }: { family: DetailedFamily, canEdit?: boolean }) {
  if (family.alerts.length === 0) return null;
  return (
    <Card className="border-l-4 border-l-red-500 bg-red-50/30">
      <div className="p-5 border-b border-red-100 flex gap-2 items-center">
        <ShieldAlert className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold text-red-900">Attention Required</h3>
      </div>
      <div className="p-5 space-y-4">
        {family.alerts.map((flag, i) => (
          <div key={i} className="flex gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-800">{flag.type}</h4>
              <p className="text-xs text-slate-600 mt-1">{flag.problem}</p>
            </div>
          </div>
        ))}
        {canEdit && (<button className="w-full mt-2 py-2 bg-white border border-red-200 text-red-700 text-sm font-semibold rounded hover:bg-red-50 transition">
          Resolve Issues
        </button>)}
      </div>
    </Card>
  );
}
