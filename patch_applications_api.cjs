const fs = require('fs');
let content = fs.readFileSync('src/pages/Applications.tsx', 'utf8');

const importReplacement = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { apiClient } from '../api/client';
import { AlertCircle } from 'lucide-react';`;
content = content.replace(/import React[\s\S]*?import \{ AlertCircle \} from 'lucide-react';/, importReplacement);

const newBody = `export function Applications() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient.get('/applications');
        // enrich manually for demo
        const enriched = data.map((a: any) => ({
          ...a,
          applicantName: a.beneficiary_member_id,
          schemeName: a.scheme_id,
          department: "Assorted",
          pendingDays: a.pending_days,
          currentStage: a.current_stage
        }));
        setApplications(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-slate-500">Loading live applications...</div>;

  const enrichedApplications = applications;`;

content = content.replace(/export function Applications\(\) \{[\s\S]*?const enrichedApplications = mockApplications[\s\S]*?\n  \}\);/, newBody);

fs.writeFileSync('src/pages/Applications.tsx', content);
