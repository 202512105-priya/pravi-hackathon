const fs = require('fs');

const firstNamesMale = ["Aarav", "Ravi", "Kanti", "Suresh", "Dinesh", "Rahul", "Vikram", "Hasmukh", "Jignesh", "Harish", "Prakash", "Gaurav"];
const firstNamesFemale = ["Meena", "Geeta", "Priya", "Kamla", "Sunita", "Anita", "Kavita", "Smita", "Neha", "Bhavna", "Kiran"];
const lastNames = ["Patel", "Shah", "Desai", "Parmar", "Joshi", "Mehta", "Chauhan", "Modi", "Rathod", "Solanki"];
const villages = ["Modasar", "Bhatia", "Sanand", "Bavla", "Dholka", "Mandal", "Detroj", "Viramgam", "Dhandhuka", "Dholera"];
const districts = ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Navsari"];
const schemes = [
  { id: "SCH-PDS-01", name: "Antyodaya Anna Yojana", dept: "PDS" },
  { id: "SCH-EDU-01", name: "Higher Education Scholarship", dept: "Education" },
  { id: "SCH-HOU-01", name: "Housing Upgrade Grant", dept: "Housing" },
  { id: "SCH-PEN-01", name: "Senior Citizen Pension", dept: "Pension" },
  { id: "SCH-WCD-01", name: "Maternal Health Support", dept: "WCD" },
  { id: "SCH-HLT-01", name: "Mukhyamantri Amrutam", dept: "Health" }
];

function r(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const families = [];
const benefits = [];
const applications = [];
const conflicts = [];
const events = [];
const audits = [];
const reviewTasks = [];
const alerts = [];

// GJ-F-10293 is the demo family, keep it.
families.push({
  id: "GJ-F-10293", headName: "Ravi Sharma", status: "Active", district: "Ahmedabad", taluka: "Sanand", village: "Modasar", pincode: "382220", 
  address: "14, Ramdev Nagar, Sector 2", rationCardType: "BPL", annualIncome: 85000,
  members: [
    { id: "MEM-001", name: "Ravi Sharma", gender: "Male", age: 45, relation: "Head", aadhaarRef: "AADHAAR_REF_83921" },
    { id: "MEM-002", name: "Meena Sharma", gender: "Female", age: 41, relation: "Spouse", aadhaarRef: "AADHAAR_REF_44102" },
    { id: "MEM-003", name: "Priya Sharma", gender: "Female", age: 19, relation: "Child", aadhaarRef: "AADHAAR_REF_11094" },
    { id: "MEM-004", name: "Arjun Sharma", gender: "Male", age: 16, relation: "Child", aadhaarRef: "AADHAAR_REF_77382" },
    { id: "MEM-005", name: "Kamla Devi", gender: "Female", age: 68, relation: "Other", aadhaarRef: "AADHAAR_REF_22910" }
  ]
});

// Generate 9 more families
for (let i = 1; i <= 9; i++) {
  const fId = `FAM-2026-${String(i).padStart(3, '0')}`;
  const headGender = Math.random() > 0.5 ? "Male" : "Female";
  const headName = `${r(headGender === "Male" ? firstNamesMale : firstNamesFemale)} ${r(lastNames)}`;
  
  const memberCount = rInt(2, 6);
  const members = [{ id: "M-1", name: headName, gender: headGender, age: rInt(35, 65), relation: "Head", aadhaarRef: `REF-${rInt(1000,9999)}` }];
  
  if (memberCount > 1) {
    const spGender = headGender === "Male" ? "Female" : "Male";
    const spName = `${r(spGender === "Male" ? firstNamesMale : firstNamesFemale)} ${headName.split(' ')[1]}`;
    members.push({ id: "M-2", name: spName, gender: spGender, age: members[0].age - rInt(1, 5), relation: "Spouse", aadhaarRef: `REF-${rInt(1000,9999)}` });
  }
  for (let m = 3; m <= memberCount; m++) {
    const cGender = Math.random() > 0.5 ? "Male" : "Female";
    const cName = `${r(cGender === "Male" ? firstNamesMale : firstNamesFemale)} ${headName.split(' ')[1]}`;
    members.push({ id: `M-${m}`, name: cName, gender: cGender, age: rInt(5, 25), relation: "Child", aadhaarRef: `REF-${rInt(1000,9999)}` });
  }

  families.push({
    id: fId, headName, status: "Active", district: r(districts), taluka: "Central", village: r(villages), pincode: "380001",
    address: `${rInt(1,100)}, Main Bazar`, rationCardType: r(["BPL", "APL", "AAY"]), annualIncome: rInt(40000, 300000),
    members
  });
}

// Generate Benefits, Applications, Conflicts, Events for each family
families.forEach((f, idx) => {
  // Benefits & Apps
  const numBen = rInt(1, 3);
  for(let b=0; b<numBen; b++) {
    const scheme = r(schemes);
    const member = r(f.members);
    const appId = `APP-${f.id}-${b}`;
    const benId = `BEN-${f.id}-${b}`;
    const amount = rInt(5, 50) * 1000;
    const isPending = Math.random() > 0.6;
    
    applications.push({
      id: appId, familyId: f.id, beneficiaryMemberId: member.id, schemeId: scheme.id, schemeName: scheme.name,
      department: scheme.dept, district: f.district, applicantName: member.name, applicantAge: member.age,
      submittedAt: `2026-0${rInt(1,8)}-${String(rInt(1,28)).padStart(2,'0')}`,
      currentStage: isPending ? r(["Submitted", "Document Verification", "Department Verification", "Payment"]) : "Delivered",
      status: isPending && Math.random() > 0.5 ? "Delayed" : "Normal",
      pendingDays: isPending ? rInt(10, 80) : 0
    });

    if (!isPending || Math.random() > 0.5) {
      benefits.push({
        id: benId, familyId: f.id, beneficiaryMemberId: member.id, schemeId: scheme.id, schemeName: scheme.name,
        department: scheme.dept, district: f.district, status: isPending ? "Verification Pending" : r(["Disbursed", "Active"]),
        sanctionedAmount: amount, paidAmount: isPending ? 0 : amount,
        lastTransaction: isPending ? null : `2026-08-${String(rInt(1,28)).padStart(2,'0')}`,
        applicationId: appId, lastVerifiedAt: `2026-07-01`, nextReviewAt: `2027-07-01`
      });
    }
  }

  // Conflict
  const confTypes = ["NAME_MISMATCH", "DOB_MISMATCH", "ADDRESS_MISMATCH", "DUPLICATE_MEMBER", "RELATIONSHIP_MISMATCH"];
  const confType = r(confTypes);
  conflicts.push({
    id: `CON-${String(idx+1).padStart(3,'0')}`, familyId: f.id, type: confType, status: r(["OPEN", "UNDER_REVIEW", "VERIFIED"]),
    department: "Cross-Department", district: f.district, matchScore: rInt(50, 95), confidence: r(["HIGH", "MEDIUM", "LOW"]),
    createdAt: "2026-09-20T08:30:00", updatedAt: "2026-09-20T08:30:00",
    factors: {
      identityReference: { score: 20, max: 25, reason: "Demo generated." },
      dobSimilarity: { score: 20, max: 20, reason: "Demo generated." },
      nameSimilarity: { score: 10, max: 20, reason: "Demo generated." },
      addressSimilarity: { score: 10, max: 15, reason: "Demo generated." },
      relationshipConsistency: { score: 10, max: 10, reason: "Demo generated." },
      sourceReliability: { score: 8, max: 10, reason: "Demo generated." }
    },
    records: [
      { system: "Family Registry", reliability: 0.95, lastSync: "2026-09-20", data: { "Name": f.headName, "Address": f.address } },
      { system: "PDS", reliability: 0.90, lastSync: "2026-09-19", data: { "Name": f.headName, "Address": "Other Address" } }
    ]
  });

  // Event
  const evtTypes = ["BIRTH", "DEATH", "MIGRATION", "ADDRESS_CHANGE"];
  const evtType = r(evtTypes);
  events.push({
    id: `EVT-${String(idx+1).padStart(3,'0')}`, familyId: f.id, eventType: evtType, affectedMemberId: f.members[0].id,
    effectiveDate: `2026-09-${String(rInt(1,20)).padStart(2,'0')}`, source: r(["Officer Report", "Civil Registration"]),
    supportingReference: `REF-${rInt(1000,9999)}`, reportedBy: "System", reportedAt: "2026-09-20T10:00:00", status: "REVIEW_REQUIRED"
  });
});

let mockDataTs = fs.readFileSync('src/data/mockData.ts', 'utf8');
// Naive regex replacement to swap out the arrays
mockDataTs = mockDataTs.replace(/export const mockFamilies: Family\[\] = \[[\s\S]*?\];/, `export const mockFamilies: Family[] = ${JSON.stringify(families, null, 2)};`);
mockDataTs = mockDataTs.replace(/export const mockBenefits: Benefit\[\] = \[[\s\S]*?\];/, `export const mockBenefits: Benefit[] = ${JSON.stringify(benefits, null, 2)};`);
mockDataTs = mockDataTs.replace(/export const mockApplications: Application\[\] = \[[\s\S]*?\];/, `export const mockApplications: Application[] = ${JSON.stringify(applications, null, 2)};`);
fs.writeFileSync('src/data/mockData.ts', mockDataTs);

let conflictTs = fs.readFileSync('src/data/conflictMockData.ts', 'utf8');
conflictTs = conflictTs.replace(/export const mockConflicts: Conflict\[\] = \[[\s\S]*?\];/, `export const mockConflicts: Conflict[] = ${JSON.stringify(conflicts, null, 2)};`);
fs.writeFileSync('src/data/conflictMockData.ts', conflictTs);

let eventTs = fs.readFileSync('src/data/eventLogic.ts', 'utf8');
eventTs = eventTs.replace(/export const sessionEvents: FamilyEvent\[\] = \[[\s\S]*?\];/, `export const sessionEvents: FamilyEvent[] = ${JSON.stringify(events, null, 2)};`);
fs.writeFileSync('src/data/eventLogic.ts', eventTs);

