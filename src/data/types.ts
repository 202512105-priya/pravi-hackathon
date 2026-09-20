export type BenefitStatus = 
  | "Eligible"
  | "Applied"
  | "Verification Pending"
  | "Verified"
  | "Approved"
  | "Disbursement Initiated"
  | "Disbursed"
  | "Received"
  | "Completed"
  | "Rejected"
  | "Suspended"
  | "Expired";

export type ApplicationStage = 
  | "Submitted"
  | "Document Verification"
  | "Department Verification"
  | "Approved"
  | "Payment"
  | "Delivered" | "Rejected";

export interface Transition {
  id: string;
  applicationId: string;
  officer: string;
  department: string;
  timestamp: string;
  reason: string;
  oldStatus: string;
  newStatus: string;
}

export interface Benefit {
  id: string;
  familyId: string;
  beneficiaryMemberId: string;
  schemeId: string;
  schemeName: string;
  department: string;
  district: string;
  status: BenefitStatus;
  sanctionedAmount: number;
  paidAmount: number;
  lastTransaction: string | null;
  applicationId: string | null;
  lastVerifiedAt: string;
  nextReviewAt: string;
}

export interface Application {
  id: string;
  familyId: string;
  beneficiaryMemberId: string;
  schemeId: string;
  schemeName: string;
  department: string;
  district: string;
  applicantName: string;
  applicantAge: number;
  submittedAt: string;
  currentStage: ApplicationStage;
  status: "Normal" | "Stuck" | "Delayed";
  pendingDays: number;
}
