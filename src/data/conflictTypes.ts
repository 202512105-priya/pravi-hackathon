export type ConflictType =
  | "NAME_MISMATCH"
  | "DOB_MISMATCH"
  | "ADDRESS_MISMATCH"
  | "DUPLICATE_MEMBER"
  | "RELATIONSHIP_MISMATCH";

export type ConflictStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "RESOLVED"
  | "UNRESOLVED";

export type ConfidenceLevel =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export interface SourceRecordComparison {
  system: string;
  reliability: number;
  lastSync: string;
  data: Record<string, string>;
}

export interface MatchFactorBreakdown {
  identityReference: { score: number; max: 25; reason: string };
  dobSimilarity: { score: number; max: 20; reason: string };
  nameSimilarity: { score: number; max: 20; reason: string };
  addressSimilarity: { score: number; max: 15; reason: string };
  relationshipConsistency: { score: number; max: 10; reason: string };
  sourceReliability: { score: number; max: 10; reason: string };
}

export interface Conflict {
  id: string;
  familyId: string;
  type: ConflictType;
  status: ConflictStatus;
  department: string;
  district: string;
  matchScore: number;
  confidence: ConfidenceLevel;
  records: SourceRecordComparison[];
  factors: MatchFactorBreakdown;
  createdAt: string;
  updatedAt: string;
}

export interface ConflictAudit {
  id: string;
  conflictId: string;
  officer: string;
  action: string;
  previousStatus: ConflictStatus;
  newStatus: ConflictStatus;
  timestamp: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}
