import type { Benefit, Application } from './types';

export type EventType =
  | "BIRTH"
  | "DEATH"
  | "MARRIAGE"
  | "DIVORCE"
  | "MIGRATION"
  | "ADDRESS_CHANGE"
  | "GUARDIAN_CHANGE"
  | "FAMILY_SPLIT"
  | "FAMILY_MERGE";

export type EventStatus = "REPORTED" | "REVIEW_REQUIRED" | "RESOLVED";

export interface FamilyEvent {
  id: string;
  familyId: string;
  eventType: EventType;
  affectedMemberId?: string;
  effectiveDate: string;
  source: string;
  supportingReference: string;
  notes?: string;
  reportedBy: string;
  reportedAt: string;
  status: EventStatus;
}

export interface ReviewTask {
  id: string;
  eventId: string;
  familyId: string;
  benefitId?: string;
  applicationId?: string;
  reason: string;
  department: string;
  assignedOfficer: string;
  priority: "High" | "Medium" | "Low";
  status: "Review Required" | "Assigned" | "In Review" | "Resolved";
}

export interface EventImpact {
  affectedBenefits: { benefit: Benefit; reason: string }[];
  affectedApplications: { app: Application; reason: string }[];
  reviewTasks: ReviewTask[];
}
