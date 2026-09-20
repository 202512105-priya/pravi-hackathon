const fs = require('fs');

let content = fs.readFileSync('src/pages/ApplicationDetail.tsx', 'utf8');

const importReplacement = `import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';`;
content = content.replace("import { useParams, Link } from 'react-router-dom';", importReplacement);

const newBody = `export function ApplicationDetail() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    try {
      await apiClient.post(\`/applications/\${applicationId}/status?status=\${encodeURIComponent(newStatus)}\`, {}, false);
      // Reload application
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
  }`;

content = content.replace(/export function ApplicationDetail\(\) \{[\s\S]*?    \);\n  \}/, newBody);

const actionButtonsHtml = `<div className="flex justify-between items-start mb-6">
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
        </div>`;

content = content.replace(/<div className="flex justify-between items-start mb-6">[\s\S]*?<\/div>\n        <\/div>/, actionButtonsHtml);

fs.writeFileSync('src/pages/ApplicationDetail.tsx', content);
