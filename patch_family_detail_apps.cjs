const fs = require('fs');
let content = fs.readFileSync('src/pages/FamilyDetail.tsx', 'utf8');

const fetchReplacement = `        const appsData = await apiClient.get(\`/families/\${familyId}/applications\`);
        
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
            }));`;

content = content.replace(/\/\/ Merge Backend Data into the detailed mock structure\n        if \(fallback\) \{[\s\S]*?fallback\.village = data\.village;/, fetchReplacement);

fs.writeFileSync('src/pages/FamilyDetail.tsx', content);
