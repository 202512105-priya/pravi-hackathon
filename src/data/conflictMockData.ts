import type { Conflict, ConflictAudit, ConfidenceLevel } from './conflictTypes';

export const DEMO_SOURCE_RELIABILITY: Record<string, number> = {
  "Family Registry": 0.95,
  "PDS": 0.90,
  "Education": 0.85,
  "Health": 0.92,
  "WCD": 0.88,
  "Housing": 0.85
};

export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 80) return "HIGH";
  if (score >= 60) return "MEDIUM";
  return "LOW";
}

export const mockConflicts: Conflict[] = [
  {
    "id": "CON-001",
    "familyId": "GJ-F-10293",
    "type": "RELATIONSHIP_MISMATCH",
    "status": "UNDER_REVIEW",
    "department": "Cross-Department",
    "district": "Ahmedabad",
    "matchScore": 76,
    "confidence": "MEDIUM",
    "createdAt": "2026-09-20T08:30:00",
    "updatedAt": "2026-09-20T08:30:00",
    "factors": {
      "identityReference": {
        "score": 20,
        "max": 25,
        "reason": "Demo generated."
      },
      "dobSimilarity": {
        "score": 20,
        "max": 20,
        "reason": "Demo generated."
      },
      "nameSimilarity": {
        "score": 10,
        "max": 20,
        "reason": "Demo generated."
      },
      "addressSimilarity": {
        "score": 10,
        "max": 15,
        "reason": "Demo generated."
      },
      "relationshipConsistency": {
        "score": 10,
        "max": 10,
        "reason": "Demo generated."
      },
      "sourceReliability": {
        "score": 8,
        "max": 10,
        "reason": "Demo generated."
      }
    },
    "records": [
      {
        "system": "Family Registry",
        "reliability": 0.95,
        "lastSync": "2026-09-20",
        "data": {
          "Name": "Ravi Sharma",
          "Address": "14, Ramdev Nagar, Sector 2"
        }
      },
      {
        "system": "PDS",
        "reliability": 0.9,
        "lastSync": "2026-09-19",
        "data": {
          "Name": "Ravi Sharma",
          "Address": "Other Address"
        }
      }
    ]
  },
  {
    "id": "CON-002",
    "familyId": "FAM-2026-001",
    "type": "ADDRESS_MISMATCH",
    "status": "UNDER_REVIEW",
    "department": "Cross-Department",
    "district": "Bhavnagar",
    "matchScore": 83,
    "confidence": "HIGH",
    "createdAt": "2026-09-20T08:30:00",
    "updatedAt": "2026-09-20T08:30:00",
    "factors": {
      "identityReference": {
        "score": 20,
        "max": 25,
        "reason": "Demo generated."
      },
      "dobSimilarity": {
        "score": 20,
        "max": 20,
        "reason": "Demo generated."
      },
      "nameSimilarity": {
        "score": 10,
        "max": 20,
        "reason": "Demo generated."
      },
      "addressSimilarity": {
        "score": 10,
        "max": 15,
        "reason": "Demo generated."
      },
      "relationshipConsistency": {
        "score": 10,
        "max": 10,
        "reason": "Demo generated."
      },
      "sourceReliability": {
        "score": 8,
        "max": 10,
        "reason": "Demo generated."
      }
    },
    "records": [
      {
        "system": "Family Registry",
        "reliability": 0.95,
        "lastSync": "2026-09-20",
        "data": {
          "Name": "Priya Modi",
          "Address": "29, Main Bazar"
        }
      },
      {
        "system": "PDS",
        "reliability": 0.9,
        "lastSync": "2026-09-19",
        "data": {
          "Name": "Priya Modi",
          "Address": "Other Address"
        }
      }
    ]
  },
  {
    "id": "CON-003",
    "familyId": "FAM-2026-002",
    "type": "NAME_MISMATCH",
    "status": "OPEN",
    "department": "Cross-Department",
    "district": "Gandhinagar",
    "matchScore": 55,
    "confidence": "LOW",
    "createdAt": "2026-09-20T08:30:00",
    "updatedAt": "2026-09-20T08:30:00",
    "factors": {
      "identityReference": {
        "score": 20,
        "max": 25,
        "reason": "Demo generated."
      },
      "dobSimilarity": {
        "score": 20,
        "max": 20,
        "reason": "Demo generated."
      },
      "nameSimilarity": {
        "score": 10,
        "max": 20,
        "reason": "Demo generated."
      },
      "addressSimilarity": {
        "score": 10,
        "max": 15,
        "reason": "Demo generated."
      },
      "relationshipConsistency": {
        "score": 10,
        "max": 10,
        "reason": "Demo generated."
      },
      "sourceReliability": {
        "score": 8,
        "max": 10,
        "reason": "Demo generated."
      }
    },
    "records": [
      {
        "system": "Family Registry",
        "reliability": 0.95,
        "lastSync": "2026-09-20",
        "data": {
          "Name": "Suresh Mehta",
          "Address": "8, Main Bazar"
        }
      },
      {
        "system": "PDS",
        "reliability": 0.9,
        "lastSync": "2026-09-19",
        "data": {
          "Name": "Suresh Mehta",
          "Address": "Other Address"
        }
      }
    ]
  },
  {
    "id": "CON-004",
    "familyId": "FAM-2026-003",
    "type": "ADDRESS_MISMATCH",
    "status": "VERIFIED",
    "department": "Cross-Department",
    "district": "Vadodara",
    "matchScore": 82,
    "confidence": "HIGH",
    "createdAt": "2026-09-20T08:30:00",
    "updatedAt": "2026-09-20T08:30:00",
    "factors": {
      "identityReference": {
        "score": 20,
        "max": 25,
        "reason": "Demo generated."
      },
      "dobSimilarity": {
        "score": 20,
        "max": 20,
        "reason": "Demo generated."
      },
      "nameSimilarity": {
        "score": 10,
        "max": 20,
        "reason": "Demo generated."
      },
      "addressSimilarity": {
        "score": 10,
        "max": 15,
        "reason": "Demo generated."
      },
      "relationshipConsistency": {
        "score": 10,
        "max": 10,
        "reason": "Demo generated."
      },
      "sourceReliability": {
        "score": 8,
        "max": 10,
        "reason": "Demo generated."
      }
    },
    "records": [
      {
        "system": "Family Registry",
        "reliability": 0.95,
        "lastSync": "2026-09-20",
        "data": {
          "Name": "Kiran Solanki",
          "Address": "56, Main Bazar"
        }
      },
      {
        "system": "PDS",
        "reliability": 0.9,
        "lastSync": "2026-09-19",
        "data": {
          "Name": "Kiran Solanki",
          "Address": "Other Address"
        }
      }
    ]
  },
  {
    "id": "CON-005",
    "familyId": "FAM-2026-004",
    "type": "NAME_MISMATCH",
    "status": "UNDER_REVIEW",
    "department": "Cross-Department",
    "district": "Bhavnagar",
    "matchScore": 93,
    "confidence": "HIGH",
    "createdAt": "2026-09-20T08:30:00",
    "updatedAt": "2026-09-20T08:30:00",
    "factors": {
      "identityReference": {
        "score": 20,
        "max": 25,
        "reason": "Demo generated."
      },
      "dobSimilarity": {
        "score": 20,
        "max": 20,
        "reason": "Demo generated."
      },
      "nameSimilarity": {
        "score": 10,
        "max": 20,
        "reason": "Demo generated."
      },
      "addressSimilarity": {
        "score": 10,
        "max": 15,
        "reason": "Demo generated."
      },
      "relationshipConsistency": {
        "score": 10,
        "max": 10,
        "reason": "Demo generated."
      },
      "sourceReliability": {
        "score": 8,
        "max": 10,
        "reason": "Demo generated."
      }
    },
    "records": [
      {
        "system": "Family Registry",
        "reliability": 0.95,
        "lastSync": "2026-09-20",
        "data": {
          "Name": "Hasmukh Patel",
          "Address": "77, Main Bazar"
        }
      },
      {
        "system": "PDS",
        "reliability": 0.9,
        "lastSync": "2026-09-19",
        "data": {
          "Name": "Hasmukh Patel",
          "Address": "Other Address"
        }
      }
    ]
  },
  {
    "id": "CON-006",
    "familyId": "FAM-2026-005",
    "type": "NAME_MISMATCH",
    "status": "OPEN",
    "department": "Cross-Department",
    "district": "Ahmedabad",
    "matchScore": 76,
    "confidence": "HIGH",
    "createdAt": "2026-09-20T08:30:00",
    "updatedAt": "2026-09-20T08:30:00",
    "factors": {
      "identityReference": {
        "score": 20,
        "max": 25,
        "reason": "Demo generated."
      },
      "dobSimilarity": {
        "score": 20,
        "max": 20,
        "reason": "Demo generated."
      },
      "nameSimilarity": {
        "score": 10,
        "max": 20,
        "reason": "Demo generated."
      },
      "addressSimilarity": {
        "score": 10,
        "max": 15,
        "reason": "Demo generated."
      },
      "relationshipConsistency": {
        "score": 10,
        "max": 10,
        "reason": "Demo generated."
      },
      "sourceReliability": {
        "score": 8,
        "max": 10,
        "reason": "Demo generated."
      }
    },
    "records": [
      {
        "system": "Family Registry",
        "reliability": 0.95,
        "lastSync": "2026-09-20",
        "data": {
          "Name": "Geeta Rathod",
          "Address": "31, Main Bazar"
        }
      },
      {
        "system": "PDS",
        "reliability": 0.9,
        "lastSync": "2026-09-19",
        "data": {
          "Name": "Geeta Rathod",
          "Address": "Other Address"
        }
      }
    ]
  },
  {
    "id": "CON-007",
    "familyId": "FAM-2026-006",
    "type": "DOB_MISMATCH",
    "status": "VERIFIED",
    "department": "Cross-Department",
    "district": "Navsari",
    "matchScore": 63,
    "confidence": "LOW",
    "createdAt": "2026-09-20T08:30:00",
    "updatedAt": "2026-09-20T08:30:00",
    "factors": {
      "identityReference": {
        "score": 20,
        "max": 25,
        "reason": "Demo generated."
      },
      "dobSimilarity": {
        "score": 20,
        "max": 20,
        "reason": "Demo generated."
      },
      "nameSimilarity": {
        "score": 10,
        "max": 20,
        "reason": "Demo generated."
      },
      "addressSimilarity": {
        "score": 10,
        "max": 15,
        "reason": "Demo generated."
      },
      "relationshipConsistency": {
        "score": 10,
        "max": 10,
        "reason": "Demo generated."
      },
      "sourceReliability": {
        "score": 8,
        "max": 10,
        "reason": "Demo generated."
      }
    },
    "records": [
      {
        "system": "Family Registry",
        "reliability": 0.95,
        "lastSync": "2026-09-20",
        "data": {
          "Name": "Meena Solanki",
          "Address": "72, Main Bazar"
        }
      },
      {
        "system": "PDS",
        "reliability": 0.9,
        "lastSync": "2026-09-19",
        "data": {
          "Name": "Meena Solanki",
          "Address": "Other Address"
        }
      }
    ]
  },
  {
    "id": "CON-008",
    "familyId": "FAM-2026-007",
    "type": "NAME_MISMATCH",
    "status": "UNDER_REVIEW",
    "department": "Cross-Department",
    "district": "Rajkot",
    "matchScore": 74,
    "confidence": "MEDIUM",
    "createdAt": "2026-09-20T08:30:00",
    "updatedAt": "2026-09-20T08:30:00",
    "factors": {
      "identityReference": {
        "score": 20,
        "max": 25,
        "reason": "Demo generated."
      },
      "dobSimilarity": {
        "score": 20,
        "max": 20,
        "reason": "Demo generated."
      },
      "nameSimilarity": {
        "score": 10,
        "max": 20,
        "reason": "Demo generated."
      },
      "addressSimilarity": {
        "score": 10,
        "max": 15,
        "reason": "Demo generated."
      },
      "relationshipConsistency": {
        "score": 10,
        "max": 10,
        "reason": "Demo generated."
      },
      "sourceReliability": {
        "score": 8,
        "max": 10,
        "reason": "Demo generated."
      }
    },
    "records": [
      {
        "system": "Family Registry",
        "reliability": 0.95,
        "lastSync": "2026-09-20",
        "data": {
          "Name": "Ravi Parmar",
          "Address": "49, Main Bazar"
        }
      },
      {
        "system": "PDS",
        "reliability": 0.9,
        "lastSync": "2026-09-19",
        "data": {
          "Name": "Ravi Parmar",
          "Address": "Other Address"
        }
      }
    ]
  },
  {
    "id": "CON-009",
    "familyId": "FAM-2026-008",
    "type": "NAME_MISMATCH",
    "status": "VERIFIED",
    "department": "Cross-Department",
    "district": "Gandhinagar",
    "matchScore": 87,
    "confidence": "LOW",
    "createdAt": "2026-09-20T08:30:00",
    "updatedAt": "2026-09-20T08:30:00",
    "factors": {
      "identityReference": {
        "score": 20,
        "max": 25,
        "reason": "Demo generated."
      },
      "dobSimilarity": {
        "score": 20,
        "max": 20,
        "reason": "Demo generated."
      },
      "nameSimilarity": {
        "score": 10,
        "max": 20,
        "reason": "Demo generated."
      },
      "addressSimilarity": {
        "score": 10,
        "max": 15,
        "reason": "Demo generated."
      },
      "relationshipConsistency": {
        "score": 10,
        "max": 10,
        "reason": "Demo generated."
      },
      "sourceReliability": {
        "score": 8,
        "max": 10,
        "reason": "Demo generated."
      }
    },
    "records": [
      {
        "system": "Family Registry",
        "reliability": 0.95,
        "lastSync": "2026-09-20",
        "data": {
          "Name": "Kiran Mehta",
          "Address": "39, Main Bazar"
        }
      },
      {
        "system": "PDS",
        "reliability": 0.9,
        "lastSync": "2026-09-19",
        "data": {
          "Name": "Kiran Mehta",
          "Address": "Other Address"
        }
      }
    ]
  },
  {
    "id": "CON-010",
    "familyId": "FAM-2026-009",
    "type": "RELATIONSHIP_MISMATCH",
    "status": "UNDER_REVIEW",
    "department": "Cross-Department",
    "district": "Ahmedabad",
    "matchScore": 60,
    "confidence": "LOW",
    "createdAt": "2026-09-20T08:30:00",
    "updatedAt": "2026-09-20T08:30:00",
    "factors": {
      "identityReference": {
        "score": 20,
        "max": 25,
        "reason": "Demo generated."
      },
      "dobSimilarity": {
        "score": 20,
        "max": 20,
        "reason": "Demo generated."
      },
      "nameSimilarity": {
        "score": 10,
        "max": 20,
        "reason": "Demo generated."
      },
      "addressSimilarity": {
        "score": 10,
        "max": 15,
        "reason": "Demo generated."
      },
      "relationshipConsistency": {
        "score": 10,
        "max": 10,
        "reason": "Demo generated."
      },
      "sourceReliability": {
        "score": 8,
        "max": 10,
        "reason": "Demo generated."
      }
    },
    "records": [
      {
        "system": "Family Registry",
        "reliability": 0.95,
        "lastSync": "2026-09-20",
        "data": {
          "Name": "Meena Chauhan",
          "Address": "24, Main Bazar"
        }
      },
      {
        "system": "PDS",
        "reliability": 0.9,
        "lastSync": "2026-09-19",
        "data": {
          "Name": "Meena Chauhan",
          "Address": "Other Address"
        }
      }
    ]
  }
];

export const mockConflictAudits: ConflictAudit[] = [
  {
    id: "AUD-1",
    conflictId: "CON-002",
    officer: "A. Sharma",
    action: "Requested Review",
    previousStatus: "OPEN",
    newStatus: "UNDER_REVIEW",
    timestamp: "2026-09-19T14:20:00",
    reason: "Requires field verification for duplicate ID."
  },
  {
    id: "AUD-2",
    conflictId: "CON-004",
    officer: "R. Patel",
    action: "Selected Preferred Record",
    previousStatus: "OPEN",
    newStatus: "VERIFIED",
    timestamp: "2026-09-16T15:30:00",
    reason: "Aadhaar verified. Registry name is correct.",
    metadata: { preferredSource: "Family Registry" }
  }
];
