const fs = require('fs');

let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

// We need to inject more benefits and applications into the mockBenefits and mockApplications arrays.
const newBenefits = `
  {
    id: "BEN-004", familyId: "FAM-2023-001", beneficiaryMemberId: "M-1", schemeId: "SCH-HOU-01", schemeName: "Housing Upgrade Grant", department: "Housing", district: "Ahmedabad", status: "Approved", sanctionedAmount: 120000, paidAmount: 40000, lastTransaction: "2026-09-01", applicationId: "APP-004", lastVerifiedAt: "2026-08-15", nextReviewAt: "2027-08-15"
  },
  {
    id: "BEN-005", familyId: "FAM-2023-002", beneficiaryMemberId: "M-1", schemeId: "SCH-HOU-01", schemeName: "Housing Upgrade Grant", department: "Housing", district: "Surat", status: "Verification Pending", sanctionedAmount: 120000, paidAmount: 0, lastTransaction: null, applicationId: "APP-005", lastVerifiedAt: "2026-09-05", nextReviewAt: "2027-09-05"
  },
  {
    id: "BEN-006", familyId: "FAM-2023-003", beneficiaryMemberId: "M-1", schemeId: "SCH-HOU-01", schemeName: "Housing Upgrade Grant", department: "Housing", district: "Rajkot", status: "Rejected", sanctionedAmount: 0, paidAmount: 0, lastTransaction: null, applicationId: "APP-006", lastVerifiedAt: "2026-09-10", nextReviewAt: "-"
  },
  {
    id: "BEN-007", familyId: "FAM-2023-089", beneficiaryMemberId: "M-1", schemeId: "SCH-HOU-01", schemeName: "Housing Upgrade Grant", department: "Housing", district: "Surat", status: "Disbursed", sanctionedAmount: 120000, paidAmount: 120000, lastTransaction: "2026-09-18", applicationId: "APP-007", lastVerifiedAt: "2026-07-20", nextReviewAt: "2027-07-20"
  },
  {
    id: "BEN-008", familyId: "FAM-2023-144", beneficiaryMemberId: "M-1", schemeId: "SCH-HOU-01", schemeName: "Housing Upgrade Grant", department: "Housing", district: "Vadodara", status: "Verification Pending", sanctionedAmount: 120000, paidAmount: 0, lastTransaction: null, applicationId: "APP-008", lastVerifiedAt: "2026-09-01", nextReviewAt: "2027-09-01"
  }
`;

const newApplications = `
  {
    id: "APP-004", familyId: "FAM-2023-001", beneficiaryMemberId: "M-1", schemeId: "SCH-HOU-01", schemeName: "Housing Upgrade Grant", department: "Housing", district: "Ahmedabad", applicantName: "Ramesh Patel", applicantAge: 45, submittedAt: "2026-08-01", currentStage: "Payment", status: "Normal", pendingDays: 5
  },
  {
    id: "APP-005", familyId: "FAM-2023-002", beneficiaryMemberId: "M-1", schemeId: "SCH-HOU-01", schemeName: "Housing Upgrade Grant", department: "Housing", district: "Surat", applicantName: "Suresh Desai", applicantAge: 50, submittedAt: "2026-07-15", currentStage: "Document Verification", status: "Delayed", pendingDays: 67
  },
  {
    id: "APP-006", familyId: "FAM-2023-003", beneficiaryMemberId: "M-1", schemeId: "SCH-HOU-01", schemeName: "Housing Upgrade Grant", department: "Housing", district: "Rajkot", applicantName: "Dinesh Parmar", applicantAge: 38, submittedAt: "2026-09-01", currentStage: "Department Verification", status: "Normal", pendingDays: 19
  },
  {
    id: "APP-007", familyId: "FAM-2023-089", beneficiaryMemberId: "M-1", schemeId: "SCH-HOU-01", schemeName: "Housing Upgrade Grant", department: "Housing", district: "Surat", applicantName: "Kanti Shah", applicantAge: 60, submittedAt: "2026-05-10", currentStage: "Delivered", status: "Normal", pendingDays: 0
  },
  {
    id: "APP-008", familyId: "FAM-2023-144", beneficiaryMemberId: "M-1", schemeId: "SCH-HOU-01", schemeName: "Housing Upgrade Grant", department: "Housing", district: "Vadodara", applicantName: "Geeta Desai", applicantAge: 35, submittedAt: "2026-08-20", currentStage: "Submitted", status: "Delayed", pendingDays: 31
  }
`;

content = content.replace(/export const mockBenefits: Benefit\[\] = \[/, \`export const mockBenefits: Benefit[] = [\${newBenefits},\`);
content = content.replace(/export const mockApplications: Application\[\] = \[/, \`export const mockApplications: Application[] = [\${newApplications},\`);

fs.writeFileSync('src/data/mockData.ts', content);
