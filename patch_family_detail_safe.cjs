const fs = require('fs');

let content = fs.readFileSync('src/pages/FamilyDetail.tsx', 'utf8');

content = "import { useState, useEffect } from 'react';\nimport { apiClient } from '../api/client';\n" + content;

const oldComponentBody = `export function FamilyDetail() {
  const { familyId } = useParams<{ familyId: string }>();
  
  // Use dynamic mock generator instead of a hardcoded lookup
  const family = familyId ? getFamilyDetail(familyId) : null;

  if (!family) {
    return <div className="p-8 text-center text-slate-500">Family not found.</div>;
  }`;

const newComponentBody = `export function FamilyDetail() {
  const { familyId } = useParams<{ familyId: string }>();
  
  const [family, setFamily] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFamily() {
      if (!familyId) return;
      try {
        const data = await apiClient.get(\`/families/\${familyId}\`);
        
        // Temporarily map to the mock DetailedFamily shape to preserve UI precisely
        const mapped = {
          id: data.id,
          headName: data.head_name,
          district: data.district,
          taluka: data.taluka,
          village: data.village,
          rationCardStatus: data.ration_card_status || 'Active',
          members: data.members.map((m: any) => ({
            id: m.id,
            name: m.name,
            age: m.age,
            gender: m.gender,
            relation: m.relation,
            aadhaarRef: m.aadhaar_ref
          })),
          // We could fetch these from /families/:id/benefits etc, but for phase 1 we mock the UI subcomponents
          activeBenefits: [],
          pendingApplications: [],
          timeline: [],
          familyEvents: []
        };
        
        // We will just merge it with the dynamic generator to keep the UI rich, 
        // demonstrating the hybrid approach.
        const fallback = getFamilyDetail(familyId);
        setFamily({ ...fallback, ...mapped });
      } catch (err) {
        console.error(err);
        // Fallback to purely mock if backend fails
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
  }`;

content = content.replace(oldComponentBody, newComponentBody);
fs.writeFileSync('src/pages/FamilyDetail.tsx', content);
