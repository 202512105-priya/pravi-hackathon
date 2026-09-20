const fs = require('fs');

// Analytics.tsx
let analyticsTs = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');

analyticsTs = analyticsTs.replace("import { mockApplications, mockConflicts } from '../data/mockData';", "import { mockApplications } from '../data/mockData';\nimport { mockConflicts } from '../data/conflictMockData';");
analyticsTs = analyticsTs.replace("FunnelChart, Funnel, LabelList, LineChart, Line, PieChart, Pie", "LabelList, LineChart, Line, PieChart, Pie");
analyticsTs = analyticsTs.replace("import { ArrowRight, Activity, Filter, Map, FileWarning }", "import { ArrowRight, Activity, FileWarning }");
analyticsTs = analyticsTs.replace("onClick={(data) => navigate(`/applications`)}", "onClick={() => navigate(`/applications`)}");
analyticsTs = analyticsTs.replace("funnelData.map((entry, index)", "funnelData.map((_, index)");
analyticsTs = analyticsTs.replace("onClick={(data) => navigate(`/analytics/districts/${data.district}`)}", "onClick={(data: any) => navigate(`/analytics/districts/${data.district}`)}");
analyticsTs = analyticsTs.replace("label={(entry) => `${entry.name} (${entry.count})`}", "label={(entry: any) => `${entry.name} (${entry.count})`}");
analyticsTs = analyticsTs.replace("conflictCategories.map((entry, index)", "conflictCategories.map((_, index)");

fs.writeFileSync('src/pages/Analytics.tsx', analyticsTs);

// DistrictAnalytics.tsx
let distTs = fs.readFileSync('src/pages/DistrictAnalytics.tsx', 'utf8');

distTs = distTs.replace("import { Analytics } from './Analytics'; // Reuse the component by scoping it internally", "");
distTs = distTs.replace("import { useState } from 'react';", "");
distTs = distTs.replace("import { mockApplications, mockConflicts, mockFamilies } from '../data/mockData';", "import { mockApplications } from '../data/mockData';\nimport { mockConflicts } from '../data/conflictMockData';");
distTs = distTs.replace("import { ArrowLeft, ArrowRight, FileWarning }", "import { ArrowLeft, FileWarning }");
distTs = distTs.replace("funnelData.map((entry, index)", "funnelData.map((_, index)");

fs.writeFileSync('src/pages/DistrictAnalytics.tsx', distTs);
