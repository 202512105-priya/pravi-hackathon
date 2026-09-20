const fs = require('fs');

let content = fs.readFileSync('src/pages/FamilyDetail.tsx', 'utf8');

const importReplacement = `import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ShieldAlert, Users, CheckCircle2, ChevronRight, AlertTriangle, FileText, Activity } from 'lucide-react';
import { HouseholdMembers } from '../components/family/HouseholdMembers';
import { EventTimeline } from '../components/family/EventTimeline';
import { apiClient } from '../api/client';`;

// We'll just replace the first few imports
content = content.replace(/import \{ useParams.*?from 'react-router-dom';[\s\S]*?import \{ EventTimeline \} from '\.\.\/components\/family\/EventTimeline';/, importReplacement);

// We'll replace the component body to handle async
const oldComponentBody = `export function FamilyDetail() {
  const { familyId } = useParams<{ familyId: string }>();
  
  // Use dynamic mock generator instead of a hardcoded lookup
  const family = getFamilyDetail(familyId || '');

  if (!family) {
    return <div className="p-8 text-center text-slate-500">Family not found.</div>;
  }`;

const newComponentBody = `export function FamilyDetail() {
  const { familyId } = useParams<{ familyId: string }>();
  const [family, setFamily] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFamily() {
      try {
        const data = await apiClient.get(\`/families/\${familyId}\`);
        // Map backend schema to frontend expectation
        const mappedData = {
          id: data.id,
          headName: data.head_name,
          district: data.district,
          taluka: data.taluka,
          village: data.village,
          rationCardStatus: data.ration_card_status,
          members: data.members.map((m: any) => ({
            id: m.id,
            name: m.name,
            age: m.age,
            gender: m.gender,
            relation: m.relation,
            aadhaarRef: m.aadhaar_ref
          })),
          // Fallbacks for now since backend doesn't have timeline/benefits inside family response
          timeline: [],
          familyEvents: [],
          activeBenefits: [],
          pendingApplications: []
        };
        setFamily(mappedData);
      } catch (err) {
        console.error(err);
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
  }`;

content = content.replace(oldComponentBody, newComponentBody);

fs.writeFileSync('src/pages/FamilyDetail.tsx', content);
