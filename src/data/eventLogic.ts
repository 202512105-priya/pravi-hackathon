import type { FamilyEvent, ReviewTask, EventImpact } from './eventTypes';
import { mockBenefits, mockApplications } from './mockData';
import type { Family } from './mockData';

// Mutable in-memory stores for the demo session
export const sessionEvents: FamilyEvent[] = [
  {
    "id": "EVT-001",
    "familyId": "GJ-F-10293",
    "eventType": "DEATH",
    "affectedMemberId": "MEM-001",
    "effectiveDate": "2026-09-09",
    "source": "Civil Registration",
    "supportingReference": "REF-2693",
    "reportedBy": "System",
    "reportedAt": "2026-09-20T10:00:00",
    "status": "REVIEW_REQUIRED"
  },
  {
    "id": "EVT-002",
    "familyId": "FAM-2026-001",
    "eventType": "MIGRATION",
    "affectedMemberId": "M-1",
    "effectiveDate": "2026-09-01",
    "source": "Officer Report",
    "supportingReference": "REF-7442",
    "reportedBy": "System",
    "reportedAt": "2026-09-20T10:00:00",
    "status": "REVIEW_REQUIRED"
  },
  {
    "id": "EVT-003",
    "familyId": "FAM-2026-002",
    "eventType": "ADDRESS_CHANGE",
    "affectedMemberId": "M-1",
    "effectiveDate": "2026-09-19",
    "source": "Officer Report",
    "supportingReference": "REF-5982",
    "reportedBy": "System",
    "reportedAt": "2026-09-20T10:00:00",
    "status": "REVIEW_REQUIRED"
  },
  {
    "id": "EVT-004",
    "familyId": "FAM-2026-003",
    "eventType": "BIRTH",
    "affectedMemberId": "M-1",
    "effectiveDate": "2026-09-04",
    "source": "Civil Registration",
    "supportingReference": "REF-3969",
    "reportedBy": "System",
    "reportedAt": "2026-09-20T10:00:00",
    "status": "REVIEW_REQUIRED"
  },
  {
    "id": "EVT-005",
    "familyId": "FAM-2026-004",
    "eventType": "DEATH",
    "affectedMemberId": "M-1",
    "effectiveDate": "2026-09-04",
    "source": "Civil Registration",
    "supportingReference": "REF-9808",
    "reportedBy": "System",
    "reportedAt": "2026-09-20T10:00:00",
    "status": "REVIEW_REQUIRED"
  },
  {
    "id": "EVT-006",
    "familyId": "FAM-2026-005",
    "eventType": "ADDRESS_CHANGE",
    "affectedMemberId": "M-1",
    "effectiveDate": "2026-09-04",
    "source": "Officer Report",
    "supportingReference": "REF-2004",
    "reportedBy": "System",
    "reportedAt": "2026-09-20T10:00:00",
    "status": "REVIEW_REQUIRED"
  },
  {
    "id": "EVT-007",
    "familyId": "FAM-2026-006",
    "eventType": "MIGRATION",
    "affectedMemberId": "M-1",
    "effectiveDate": "2026-09-01",
    "source": "Officer Report",
    "supportingReference": "REF-9689",
    "reportedBy": "System",
    "reportedAt": "2026-09-20T10:00:00",
    "status": "REVIEW_REQUIRED"
  },
  {
    "id": "EVT-008",
    "familyId": "FAM-2026-007",
    "eventType": "BIRTH",
    "affectedMemberId": "M-1",
    "effectiveDate": "2026-09-05",
    "source": "Officer Report",
    "supportingReference": "REF-9785",
    "reportedBy": "System",
    "reportedAt": "2026-09-20T10:00:00",
    "status": "REVIEW_REQUIRED"
  },
  {
    "id": "EVT-009",
    "familyId": "FAM-2026-008",
    "eventType": "DEATH",
    "affectedMemberId": "M-1",
    "effectiveDate": "2026-09-17",
    "source": "Officer Report",
    "supportingReference": "REF-8564",
    "reportedBy": "System",
    "reportedAt": "2026-09-20T10:00:00",
    "status": "REVIEW_REQUIRED"
  },
  {
    "id": "EVT-010",
    "familyId": "FAM-2026-009",
    "eventType": "DEATH",
    "affectedMemberId": "M-1",
    "effectiveDate": "2026-09-10",
    "source": "Civil Registration",
    "supportingReference": "REF-5709",
    "reportedBy": "System",
    "reportedAt": "2026-09-20T10:00:00",
    "status": "REVIEW_REQUIRED"
  }
];

export const sessionReviewTasks: ReviewTask[] = [];

export function generateId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 10000)}`;
}

export function assessEventImpact(event: FamilyEvent, family: Family): EventImpact {
  const impact: EventImpact = {
    affectedBenefits: [],
    affectedApplications: [],
    reviewTasks: []
  };

  const familyBenefits = mockBenefits.filter(b => b.familyId === family.id && ['Completed', 'Disbursed', 'Active', 'Verification Pending'].includes(b.status));
  const familyApps = mockApplications.filter(a => a.familyId === family.id && !['Delivered', 'Rejected'].includes(a.currentStage));

  const addReviewTask = (dept: string, reason: string, priority: "High" | "Medium" | "Low", bId?: string, aId?: string) => {
    const task: ReviewTask = {
      id: generateId('RT'),
      eventId: event.id,
      familyId: family.id,
      benefitId: bId,
      applicationId: aId,
      department: dept,
      reason,
      assignedOfficer: 'Pending Assignment',
      priority,
      status: 'Review Required'
    };
    impact.reviewTasks.push(task);
  };

  switch (event.eventType) {
    case "MIGRATION":
    case "ADDRESS_CHANGE":
      familyBenefits.forEach(b => {
        if (['Housing', 'PDS', 'Education'].includes(b.department)) {
          impact.affectedBenefits.push({ benefit: b, reason: "District/Location dependency" });
          addReviewTask(b.department, `Verify migration and current household location for ${b.schemeName}`, 'High', b.id);
        }
      });
      familyApps.forEach(a => {
        impact.affectedApplications.push({ app: a, reason: "Application contains old address" });
        addReviewTask(a.department, `Review pending application address requirements`, 'Medium', undefined, a.id);
      });
      break;

    case "DEATH":
      if (event.affectedMemberId) {
        familyBenefits.forEach(b => {
          if (b.beneficiaryMemberId === event.affectedMemberId) {
            impact.affectedBenefits.push({ benefit: b, reason: "Beneficiary marked as deceased" });
            addReviewTask(b.department, `Review beneficiary status for deceased member`, 'High', b.id);
          }
        });
        familyApps.forEach(a => {
          if (a.beneficiaryMemberId === event.affectedMemberId) {
            impact.affectedApplications.push({ app: a, reason: "Applicant marked as deceased" });
            addReviewTask(a.department, `Review eligibility for deceased applicant`, 'High', undefined, a.id);
          }
        });
      }
      break;

    case "MARRIAGE":
    case "DIVORCE":
    case "FAMILY_SPLIT":
    case "FAMILY_MERGE":
      familyBenefits.forEach(b => {
        if (['PDS', 'Housing'].includes(b.department)) {
          impact.affectedBenefits.push({ benefit: b, reason: "Household composition changed" });
          addReviewTask(b.department, `Reassess household eligibility`, 'Medium', b.id);
        }
      });
      break;

    case "GUARDIAN_CHANGE":
      familyBenefits.forEach(b => {
        if (['WCD', 'Education'].includes(b.department)) {
          impact.affectedBenefits.push({ benefit: b, reason: "Guardian dependency altered" });
          addReviewTask(b.department, `Verify new guardian documentation`, 'Medium', b.id);
        }
      });
      break;
      
    case "BIRTH":
      addReviewTask("Health", "Trigger newborn health scheme enrollment checks", 'Low');
      addReviewTask("WCD", "Verify supplementary nutrition eligibility", 'Medium');
      break;
  }

  // Ensure unique tasks if multiple generic rules apply
  return impact;
}
