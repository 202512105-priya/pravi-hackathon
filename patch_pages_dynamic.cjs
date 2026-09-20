const fs = require('fs');

let content = fs.readFileSync('src/pages/Pages.tsx', 'utf8');

const importReplacement = `import { useState, useEffect } from 'react';
import { mockFamilies } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { KPIGrid } from '../components/dashboard/KPIGrid';
import { ApplicationBottleneckChart } from '../components/dashboard/ApplicationBottleneckChart';
import { CasesAttentionTable } from '../components/dashboard/CasesAttentionTable';
import { DistrictBenefitCoverage } from '../components/dashboard/DistrictBenefitCoverage';
import { RecentEvents } from '../components/dashboard/RecentEvents';
import { DataQualityAlerts } from '../components/dashboard/DataQualityAlerts';`;
content = content.replace(/import \{ useState, useEffect \} from 'react';[\s\S]*?import \{ DataQualityAlerts \} from '\.\.\/components\/dashboard\/DataQualityAlerts';/, importReplacement);

const dashboardReplacement = `export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, hasRole } = useAuth();

  useEffect(() => {
    // Simulate loading delay for realism
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isStateLevel = hasRole(['STATE_ADMIN', 'AUDITOR']);
  const isDistrict = hasRole(['DISTRICT_OFFICER']);
  const isDept = hasRole(['DEPARTMENT_OFFICER']);
  const isField = hasRole(['FIELD_WORKER']);

  return (
    <div className="pb-8">
      {/* 
        We pass down the user context to header. Since we don't want to rewrite all child components,
        we can wrap DashboardHeader to dynamically replace its static title for now.
      */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-1">
          Welcome back, {user?.username || 'Officer'}
        </h1>
        <p className="text-slate-500">
          {isStateLevel && "Here's the statewide operations overview."}
          {isDistrict && \`Here's the operational overview for \${user?.district} District.\`}
          {isDept && \`Here's the scheme status for the \${user?.department} Department.\`}
          {isField && \`Here are your priority tasks for \${user?.taluka} Taluka.\`}
        </p>
      </div>
      
      {(isStateLevel || isDistrict || isDept) && <KPIGrid isLoading={isLoading} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {(isStateLevel || isDept) && (
          <div className="lg:col-span-2">
            <ApplicationBottleneckChart isLoading={isLoading} />
          </div>
        )}
        {(isStateLevel || isDistrict) && (
          <div className={isDept ? "lg:col-span-1" : "lg:col-span-3"}>
            <DistrictBenefitCoverage isLoading={isLoading} />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={(isStateLevel || isDistrict) ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          {(isStateLevel || isDistrict || isField) && <CasesAttentionTable isLoading={isLoading} />}
          {(isStateLevel || isDistrict || isField) && <RecentEvents isLoading={isLoading} />}
        </div>
        
        {(isStateLevel || isDistrict) && (
          <div>
            <DataQualityAlerts isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
}`;

content = content.replace(/export function Dashboard\(\) \{[\s\S]*?    <\/div>\n  \);\n\}/, dashboardReplacement);

fs.writeFileSync('src/pages/Pages.tsx', content);
