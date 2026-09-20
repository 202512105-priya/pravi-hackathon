export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  relation: string;
  aadhaarRef: string;
}

export interface Family {
  id: string;
  headName: string;
  district: string;
  taluka: string;
  village: string;
  pincode?: string;
  address?: string;
  rationCardType?: string;
  annualIncome?: number;
  householdStatus?: string;
  rationCardStatus?: 'Active' | 'Suspended';
  members: FamilyMember[];
}

export const mockFamilies: Family[] = [
  {
    "id": "GJ-F-10293",
    "headName": "Ravi Sharma",
    "householdStatus": "Active",
    "district": "Ahmedabad",
    "taluka": "Sanand",
    "village": "Modasar",
    "pincode": "382220",
    "address": "14, Ramdev Nagar, Sector 2",
    "rationCardType": "BPL",
    "annualIncome": 85000,
    "members": [
      {
        "id": "MEM-001",
        "name": "Ravi Sharma",
        "gender": "M",
        "age": 45,
        "relation": "Head",
        "aadhaarRef": "AADHAAR_REF_83921"
      },
      {
        "id": "MEM-002",
        "name": "Meena Sharma",
        "gender": "F",
        "age": 41,
        "relation": "Spouse",
        "aadhaarRef": "AADHAAR_REF_44102"
      },
      {
        "id": "MEM-003",
        "name": "Priya Sharma",
        "gender": "F",
        "age": 19,
        "relation": "Child",
        "aadhaarRef": "AADHAAR_REF_11094"
      },
      {
        "id": "MEM-004",
        "name": "Arjun Sharma",
        "gender": "M",
        "age": 16,
        "relation": "Child",
        "aadhaarRef": "AADHAAR_REF_77382"
      },
      {
        "id": "MEM-005",
        "name": "Kamla Devi",
        "gender": "F",
        "age": 68,
        "relation": "Other",
        "aadhaarRef": "AADHAAR_REF_22910"
      }
    ]
  },
  {
    "id": "FAM-2026-001",
    "headName": "Priya Modi",
    "householdStatus": "Active",
    "district": "Bhavnagar",
    "taluka": "Central",
    "village": "Dhandhuka",
    "pincode": "380001",
    "address": "29, Main Bazar",
    "rationCardType": "AAY",
    "annualIncome": 81423,
    "members": [
      {
        "id": "M-1",
        "name": "Priya Modi",
        "gender": "F",
        "age": 59,
        "relation": "Head",
        "aadhaarRef": "REF-5856"
      },
      {
        "id": "M-2",
        "name": "Harish Modi",
        "gender": "M",
        "age": 54,
        "relation": "Spouse",
        "aadhaarRef": "REF-9023"
      },
      {
        "id": "M-3",
        "name": "Kanti Modi",
        "gender": "M",
        "age": 8,
        "relation": "Child",
        "aadhaarRef": "REF-2030"
      },
      {
        "id": "M-4",
        "name": "Priya Modi",
        "gender": "F",
        "age": 10,
        "relation": "Child",
        "aadhaarRef": "REF-8413"
      }
    ]
  },
  {
    "id": "FAM-2026-002",
    "headName": "Suresh Mehta",
    "householdStatus": "Active",
    "district": "Gandhinagar",
    "taluka": "Central",
    "village": "Mandal",
    "pincode": "380001",
    "address": "8, Main Bazar",
    "rationCardType": "AAY",
    "annualIncome": 286897,
    "members": [
      {
        "id": "M-1",
        "name": "Suresh Mehta",
        "gender": "M",
        "age": 45,
        "relation": "Head",
        "aadhaarRef": "REF-2507"
      },
      {
        "id": "M-2",
        "name": "Kavita Mehta",
        "gender": "F",
        "age": 40,
        "relation": "Spouse",
        "aadhaarRef": "REF-4409"
      }
    ]
  },
  {
    "id": "FAM-2026-003",
    "headName": "Kiran Solanki",
    "householdStatus": "Active",
    "district": "Vadodara",
    "taluka": "Central",
    "village": "Bhatia",
    "pincode": "380001",
    "address": "56, Main Bazar",
    "rationCardType": "BPL",
    "annualIncome": 121467,
    "members": [
      {
        "id": "M-1",
        "name": "Kiran Solanki",
        "gender": "F",
        "age": 52,
        "relation": "Head",
        "aadhaarRef": "REF-3754"
      },
      {
        "id": "M-2",
        "name": "Vikram Solanki",
        "gender": "M",
        "age": 47,
        "relation": "Spouse",
        "aadhaarRef": "REF-6919"
      },
      {
        "id": "M-3",
        "name": "Geeta Solanki",
        "gender": "F",
        "age": 6,
        "relation": "Child",
        "aadhaarRef": "REF-1943"
      },
      {
        "id": "M-4",
        "name": "Suresh Solanki",
        "gender": "M",
        "age": 11,
        "relation": "Child",
        "aadhaarRef": "REF-7158"
      },
      {
        "id": "M-5",
        "name": "Jignesh Solanki",
        "gender": "M",
        "age": 16,
        "relation": "Child",
        "aadhaarRef": "REF-3292"
      },
      {
        "id": "M-6",
        "name": "Anita Solanki",
        "gender": "F",
        "age": 10,
        "relation": "Child",
        "aadhaarRef": "REF-3259"
      }
    ]
  },
  {
    "id": "FAM-2026-004",
    "headName": "Hasmukh Patel",
    "householdStatus": "Active",
    "district": "Bhavnagar",
    "taluka": "Central",
    "village": "Detroj",
    "pincode": "380001",
    "address": "77, Main Bazar",
    "rationCardType": "BPL",
    "annualIncome": 274890,
    "members": [
      {
        "id": "M-1",
        "name": "Hasmukh Patel",
        "gender": "M",
        "age": 41,
        "relation": "Head",
        "aadhaarRef": "REF-1887"
      },
      {
        "id": "M-2",
        "name": "Geeta Patel",
        "gender": "F",
        "age": 39,
        "relation": "Spouse",
        "aadhaarRef": "REF-7841"
      }
    ]
  },
  {
    "id": "FAM-2026-005",
    "headName": "Geeta Rathod",
    "householdStatus": "Active",
    "district": "Ahmedabad",
    "taluka": "Central",
    "village": "Dholera",
    "pincode": "380001",
    "address": "31, Main Bazar",
    "rationCardType": "APL",
    "annualIncome": 219993,
    "members": [
      {
        "id": "M-1",
        "name": "Geeta Rathod",
        "gender": "F",
        "age": 62,
        "relation": "Head",
        "aadhaarRef": "REF-6733"
      },
      {
        "id": "M-2",
        "name": "Hasmukh Rathod",
        "gender": "M",
        "age": 58,
        "relation": "Spouse",
        "aadhaarRef": "REF-1198"
      }
    ]
  },
  {
    "id": "FAM-2026-006",
    "headName": "Meena Solanki",
    "householdStatus": "Active",
    "district": "Navsari",
    "taluka": "Central",
    "village": "Dholera",
    "pincode": "380001",
    "address": "72, Main Bazar",
    "rationCardType": "BPL",
    "annualIncome": 243140,
    "members": [
      {
        "id": "M-1",
        "name": "Meena Solanki",
        "gender": "F",
        "age": 56,
        "relation": "Head",
        "aadhaarRef": "REF-6103"
      },
      {
        "id": "M-2",
        "name": "Gaurav Solanki",
        "gender": "M",
        "age": 52,
        "relation": "Spouse",
        "aadhaarRef": "REF-9043"
      }
    ]
  },
  {
    "id": "FAM-2026-007",
    "headName": "Ravi Parmar",
    "householdStatus": "Active",
    "district": "Rajkot",
    "taluka": "Central",
    "village": "Modasar",
    "pincode": "380001",
    "address": "49, Main Bazar",
    "rationCardType": "APL",
    "annualIncome": 137783,
    "members": [
      {
        "id": "M-1",
        "name": "Ravi Parmar",
        "gender": "M",
        "age": 57,
        "relation": "Head",
        "aadhaarRef": "REF-9295"
      },
      {
        "id": "M-2",
        "name": "Meena Parmar",
        "gender": "F",
        "age": 52,
        "relation": "Spouse",
        "aadhaarRef": "REF-1458"
      },
      {
        "id": "M-3",
        "name": "Sunita Parmar",
        "gender": "F",
        "age": 6,
        "relation": "Child",
        "aadhaarRef": "REF-6051"
      },
      {
        "id": "M-4",
        "name": "Aarav Parmar",
        "gender": "M",
        "age": 13,
        "relation": "Child",
        "aadhaarRef": "REF-6952"
      }
    ]
  },
  {
    "id": "FAM-2026-008",
    "headName": "Kiran Mehta",
    "householdStatus": "Active",
    "district": "Gandhinagar",
    "taluka": "Central",
    "village": "Dholera",
    "pincode": "380001",
    "address": "39, Main Bazar",
    "rationCardType": "BPL",
    "annualIncome": 148798,
    "members": [
      {
        "id": "M-1",
        "name": "Kiran Mehta",
        "gender": "F",
        "age": 51,
        "relation": "Head",
        "aadhaarRef": "REF-9951"
      },
      {
        "id": "M-2",
        "name": "Gaurav Mehta",
        "gender": "M",
        "age": 48,
        "relation": "Spouse",
        "aadhaarRef": "REF-5850"
      },
      {
        "id": "M-3",
        "name": "Anita Mehta",
        "gender": "F",
        "age": 8,
        "relation": "Child",
        "aadhaarRef": "REF-5954"
      },
      {
        "id": "M-4",
        "name": "Hasmukh Mehta",
        "gender": "M",
        "age": 11,
        "relation": "Child",
        "aadhaarRef": "REF-4349"
      },
      {
        "id": "M-5",
        "name": "Hasmukh Mehta",
        "gender": "M",
        "age": 10,
        "relation": "Child",
        "aadhaarRef": "REF-1977"
      },
      {
        "id": "M-6",
        "name": "Priya Mehta",
        "gender": "F",
        "age": 11,
        "relation": "Child",
        "aadhaarRef": "REF-6455"
      }
    ]
  },
  {
    "id": "FAM-2026-009",
    "headName": "Meena Chauhan",
    "householdStatus": "Active",
    "district": "Ahmedabad",
    "taluka": "Central",
    "village": "Dholka",
    "pincode": "380001",
    "address": "24, Main Bazar",
    "rationCardType": "BPL",
    "annualIncome": 209435,
    "members": [
      {
        "id": "M-1",
        "name": "Meena Chauhan",
        "gender": "F",
        "age": 64,
        "relation": "Head",
        "aadhaarRef": "REF-9659"
      },
      {
        "id": "M-2",
        "name": "Gaurav Chauhan",
        "gender": "M",
        "age": 62,
        "relation": "Spouse",
        "aadhaarRef": "REF-1569"
      },
      {
        "id": "M-3",
        "name": "Vikram Chauhan",
        "gender": "M",
        "age": 21,
        "relation": "Child",
        "aadhaarRef": "REF-5236"
      }
    ]
  }
];

export const districtOptions = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 
  'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 
  'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 
  'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
];

export const kpiData = {
  registeredFamilies: 1245678,
  activeFamilies: 1102340,
  receivingBenefits: 980500,
  openReviews: 3456
};

export const applicationStages = [
  { name: 'Verification', count: 12500 },
  { name: 'Approval', count: 8300 },
  { name: 'Payment', count: 4200 },
  { name: 'Delivery', count: 1500 },
];

export interface Case {
  id: string;
  familyId: string;
  problem: string;
  pendingDays: number;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
}

export const mockCases: Case[] = [
  { id: 'CASE-101', familyId: 'FAM-2023-002', problem: 'Aadhaar demographic mismatch during ration card seeding', pendingDays: 14, priority: 'High', assignedTo: 'Gov Officer' },
  { id: 'CASE-102', familyId: 'FAM-2023-089', problem: 'Suspected duplicate beneficiary record', pendingDays: 5, priority: 'Medium', assignedTo: 'Gov Officer' },
  { id: 'CASE-103', familyId: 'FAM-2023-144', problem: 'Missing bank account for DBT transfer', pendingDays: 21, priority: 'High', assignedTo: 'Gov Officer' },
  { id: 'CASE-104', familyId: 'FAM-2023-210', problem: 'Member age crossed 18, verification required', pendingDays: 2, priority: 'Low', assignedTo: 'System' },
];

export const districtCoverage = [
  { name: 'Ahmedabad', coverage: 85 },
  { name: 'Surat', coverage: 78 },
  { name: 'Vadodara', coverage: 82 },
  { name: 'Rajkot', coverage: 75 },
  { name: 'Bhavnagar', coverage: 68 },
];

export interface Event {
  id: string;
  familyId: string;
  type: 'Add' | 'Update' | 'Status' | 'Alert';
  description: string;
  timestamp: string;
}

export const mockEvents: Event[] = [
  { id: 'EVT-1', familyId: 'FAM-2023-001', type: 'Add', description: 'New member Rahul Patel added via birth certificate', timestamp: '2 hours ago' },
  { id: 'EVT-2', familyId: 'FAM-2023-002', type: 'Status', description: 'Ration card suspended due to inactivity', timestamp: '5 hours ago' },
  { id: 'EVT-3', familyId: 'FAM-2023-003', type: 'Update', description: 'Address updated based on electricity bill', timestamp: '1 day ago' },
  { id: 'EVT-4', familyId: 'FAM-2023-144', type: 'Alert', description: 'Bank account verification failed', timestamp: '2 days ago' },
];

import type { Benefit, Application, Transition } from './types';

export const mockBenefits: Benefit[] = [
  {
    "id": "BEN-FAM-2026-001-0",
    "familyId": "FAM-2026-001",
    "beneficiaryMemberId": "M-4",
    "schemeId": "SCH-WCD-01",
    "schemeName": "Maternal Health Support",
    "department": "WCD",
    "district": "Bhavnagar",
    "status": "Disbursed",
    "sanctionedAmount": 19000,
    "paidAmount": 19000,
    "lastTransaction": "2026-08-19",
    "applicationId": "APP-FAM-2026-001-0",
    "lastVerifiedAt": "2026-07-01",
    "nextReviewAt": "2027-07-01"
  },
  {
    "id": "BEN-FAM-2026-001-1",
    "familyId": "FAM-2026-001",
    "beneficiaryMemberId": "M-1",
    "schemeId": "SCH-PEN-01",
    "schemeName": "Senior Citizen Pension",
    "department": "Pension",
    "district": "Bhavnagar",
    "status": "Verification Pending",
    "sanctionedAmount": 46000,
    "paidAmount": 0,
    "lastTransaction": null,
    "applicationId": "APP-FAM-2026-001-1",
    "lastVerifiedAt": "2026-07-01",
    "nextReviewAt": "2027-07-01"
  },
  {
    "id": "BEN-FAM-2026-002-0",
    "familyId": "FAM-2026-002",
    "beneficiaryMemberId": "M-2",
    "schemeId": "SCH-WCD-01",
    "schemeName": "Maternal Health Support",
    "department": "WCD",
    "district": "Gandhinagar",
    "status": "Disbursed",
    "sanctionedAmount": 7000,
    "paidAmount": 7000,
    "lastTransaction": "2026-08-23",
    "applicationId": "APP-FAM-2026-002-0",
    "lastVerifiedAt": "2026-07-01",
    "nextReviewAt": "2027-07-01"
  },
  {
    "id": "BEN-FAM-2026-002-1",
    "familyId": "FAM-2026-002",
    "beneficiaryMemberId": "M-2",
    "schemeId": "SCH-WCD-01",
    "schemeName": "Maternal Health Support",
    "department": "WCD",
    "district": "Gandhinagar",
    "status": "Disbursed",
    "sanctionedAmount": 37000,
    "paidAmount": 37000,
    "lastTransaction": "2026-08-21",
    "applicationId": "APP-FAM-2026-002-1",
    "lastVerifiedAt": "2026-07-01",
    "nextReviewAt": "2027-07-01"
  },
  {
    "id": "BEN-FAM-2026-003-0",
    "familyId": "FAM-2026-003",
    "beneficiaryMemberId": "M-3",
    "schemeId": "SCH-PEN-01",
    "schemeName": "Senior Citizen Pension",
    "department": "Pension",
    "district": "Vadodara",
    "status": "Verification Pending",
    "sanctionedAmount": 7000,
    "paidAmount": 0,
    "lastTransaction": null,
    "applicationId": "APP-FAM-2026-003-0",
    "lastVerifiedAt": "2026-07-01",
    "nextReviewAt": "2027-07-01"
  },
  {
    "id": "BEN-FAM-2026-005-0",
    "familyId": "FAM-2026-005",
    "beneficiaryMemberId": "M-1",
    "schemeId": "SCH-HLT-01",
    "schemeName": "Mukhyamantri Amrutam",
    "department": "Health",
    "district": "Ahmedabad",
    "status": "Disbursed",
    "sanctionedAmount": 32000,
    "paidAmount": 32000,
    "lastTransaction": "2026-08-01",
    "applicationId": "APP-FAM-2026-005-0",
    "lastVerifiedAt": "2026-07-01",
    "nextReviewAt": "2027-07-01"
  },
  {
    "id": "BEN-FAM-2026-007-0",
    "familyId": "FAM-2026-007",
    "beneficiaryMemberId": "M-3",
    "schemeId": "SCH-PDS-01",
    "schemeName": "Antyodaya Anna Yojana",
    "department": "PDS",
    "district": "Rajkot",
    "status": "Disbursed",
    "sanctionedAmount": 48000,
    "paidAmount": 48000,
    "lastTransaction": "2026-08-16",
    "applicationId": "APP-FAM-2026-007-0",
    "lastVerifiedAt": "2026-07-01",
    "nextReviewAt": "2027-07-01"
  },
  {
    "id": "BEN-FAM-2026-008-0",
    "familyId": "FAM-2026-008",
    "beneficiaryMemberId": "M-4",
    "schemeId": "SCH-HLT-01",
    "schemeName": "Mukhyamantri Amrutam",
    "department": "Health",
    "district": "Gandhinagar",
    "status": "Disbursed",
    "sanctionedAmount": 19000,
    "paidAmount": 19000,
    "lastTransaction": "2026-08-06",
    "applicationId": "APP-FAM-2026-008-0",
    "lastVerifiedAt": "2026-07-01",
    "nextReviewAt": "2027-07-01"
  },
  {
    "id": "BEN-FAM-2026-009-0",
    "familyId": "FAM-2026-009",
    "beneficiaryMemberId": "M-1",
    "schemeId": "SCH-EDU-01",
    "schemeName": "Higher Education Scholarship",
    "department": "Education",
    "district": "Ahmedabad",
    "status": "Disbursed",
    "sanctionedAmount": 47000,
    "paidAmount": 47000,
    "lastTransaction": "2026-08-23",
    "applicationId": "APP-FAM-2026-009-0",
    "lastVerifiedAt": "2026-07-01",
    "nextReviewAt": "2027-07-01"
  }
];

export const mockApplications: Application[] = [
  {
    "id": "APP-GJ-F-10293-0",
    "familyId": "GJ-F-10293",
    "beneficiaryMemberId": "MEM-002",
    "schemeId": "SCH-HOU-01",
    "schemeName": "Housing Upgrade Grant",
    "department": "Housing",
    "district": "Ahmedabad",
    "applicantName": "Meena Sharma",
    "applicantAge": 41,
    "submittedAt": "2026-07-07",
    "currentStage": "Department Verification",
    "status": "Normal",
    "pendingDays": 36
  },
  {
    "id": "APP-FAM-2026-001-0",
    "familyId": "FAM-2026-001",
    "beneficiaryMemberId": "M-4",
    "schemeId": "SCH-WCD-01",
    "schemeName": "Maternal Health Support",
    "department": "WCD",
    "district": "Bhavnagar",
    "applicantName": "Priya Modi",
    "applicantAge": 10,
    "submittedAt": "2026-07-24",
    "currentStage": "Delivered",
    "status": "Normal",
    "pendingDays": 0
  },
  {
    "id": "APP-FAM-2026-001-1",
    "familyId": "FAM-2026-001",
    "beneficiaryMemberId": "M-1",
    "schemeId": "SCH-PEN-01",
    "schemeName": "Senior Citizen Pension",
    "department": "Pension",
    "district": "Bhavnagar",
    "applicantName": "Priya Modi",
    "applicantAge": 59,
    "submittedAt": "2026-01-11",
    "currentStage": "Document Verification",
    "status": "Normal",
    "pendingDays": 39
  },
  {
    "id": "APP-FAM-2026-002-0",
    "familyId": "FAM-2026-002",
    "beneficiaryMemberId": "M-2",
    "schemeId": "SCH-WCD-01",
    "schemeName": "Maternal Health Support",
    "department": "WCD",
    "district": "Gandhinagar",
    "applicantName": "Kavita Mehta",
    "applicantAge": 40,
    "submittedAt": "2026-02-24",
    "currentStage": "Delivered",
    "status": "Normal",
    "pendingDays": 0
  },
  {
    "id": "APP-FAM-2026-002-1",
    "familyId": "FAM-2026-002",
    "beneficiaryMemberId": "M-2",
    "schemeId": "SCH-WCD-01",
    "schemeName": "Maternal Health Support",
    "department": "WCD",
    "district": "Gandhinagar",
    "applicantName": "Kavita Mehta",
    "applicantAge": 40,
    "submittedAt": "2026-07-18",
    "currentStage": "Delivered",
    "status": "Normal",
    "pendingDays": 0
  },
  {
    "id": "APP-FAM-2026-003-0",
    "familyId": "FAM-2026-003",
    "beneficiaryMemberId": "M-3",
    "schemeId": "SCH-PEN-01",
    "schemeName": "Senior Citizen Pension",
    "department": "Pension",
    "district": "Vadodara",
    "applicantName": "Geeta Solanki",
    "applicantAge": 6,
    "submittedAt": "2026-08-12",
    "currentStage": "Document Verification",
    "status": "Delayed",
    "pendingDays": 55
  },
  {
    "id": "APP-FAM-2026-004-0",
    "familyId": "FAM-2026-004",
    "beneficiaryMemberId": "M-1",
    "schemeId": "SCH-PEN-01",
    "schemeName": "Senior Citizen Pension",
    "department": "Pension",
    "district": "Bhavnagar",
    "applicantName": "Hasmukh Patel",
    "applicantAge": 41,
    "submittedAt": "2026-08-08",
    "currentStage": "Document Verification",
    "status": "Normal",
    "pendingDays": 54
  },
  {
    "id": "APP-FAM-2026-004-1",
    "familyId": "FAM-2026-004",
    "beneficiaryMemberId": "M-1",
    "schemeId": "SCH-PEN-01",
    "schemeName": "Senior Citizen Pension",
    "department": "Pension",
    "district": "Bhavnagar",
    "applicantName": "Hasmukh Patel",
    "applicantAge": 41,
    "submittedAt": "2026-07-05",
    "currentStage": "Payment",
    "status": "Normal",
    "pendingDays": 16
  },
  {
    "id": "APP-FAM-2026-005-0",
    "familyId": "FAM-2026-005",
    "beneficiaryMemberId": "M-1",
    "schemeId": "SCH-HLT-01",
    "schemeName": "Mukhyamantri Amrutam",
    "department": "Health",
    "district": "Ahmedabad",
    "applicantName": "Geeta Rathod",
    "applicantAge": 62,
    "submittedAt": "2026-07-23",
    "currentStage": "Delivered",
    "status": "Normal",
    "pendingDays": 0
  },
  {
    "id": "APP-FAM-2026-006-0",
    "familyId": "FAM-2026-006",
    "beneficiaryMemberId": "M-2",
    "schemeId": "SCH-EDU-01",
    "schemeName": "Higher Education Scholarship",
    "department": "Education",
    "district": "Navsari",
    "applicantName": "Gaurav Solanki",
    "applicantAge": 52,
    "submittedAt": "2026-07-26",
    "currentStage": "Payment",
    "status": "Normal",
    "pendingDays": 22
  },
  {
    "id": "APP-FAM-2026-006-1",
    "familyId": "FAM-2026-006",
    "beneficiaryMemberId": "M-2",
    "schemeId": "SCH-HOU-01",
    "schemeName": "Housing Upgrade Grant",
    "department": "Housing",
    "district": "Navsari",
    "applicantName": "Gaurav Solanki",
    "applicantAge": 52,
    "submittedAt": "2026-01-19",
    "currentStage": "Submitted",
    "status": "Normal",
    "pendingDays": 64
  },
  {
    "id": "APP-FAM-2026-007-0",
    "familyId": "FAM-2026-007",
    "beneficiaryMemberId": "M-3",
    "schemeId": "SCH-PDS-01",
    "schemeName": "Antyodaya Anna Yojana",
    "department": "PDS",
    "district": "Rajkot",
    "applicantName": "Sunita Parmar",
    "applicantAge": 6,
    "submittedAt": "2026-05-02",
    "currentStage": "Delivered",
    "status": "Normal",
    "pendingDays": 0
  },
  {
    "id": "APP-FAM-2026-008-0",
    "familyId": "FAM-2026-008",
    "beneficiaryMemberId": "M-4",
    "schemeId": "SCH-HLT-01",
    "schemeName": "Mukhyamantri Amrutam",
    "department": "Health",
    "district": "Gandhinagar",
    "applicantName": "Hasmukh Mehta",
    "applicantAge": 11,
    "submittedAt": "2026-08-06",
    "currentStage": "Delivered",
    "status": "Normal",
    "pendingDays": 0
  },
  {
    "id": "APP-FAM-2026-009-0",
    "familyId": "FAM-2026-009",
    "beneficiaryMemberId": "M-1",
    "schemeId": "SCH-EDU-01",
    "schemeName": "Higher Education Scholarship",
    "department": "Education",
    "district": "Ahmedabad",
    "applicantName": "Meena Chauhan",
    "applicantAge": 64,
    "submittedAt": "2026-04-19",
    "currentStage": "Delivered",
    "status": "Normal",
    "pendingDays": 0
  }
];

export const mockTransitions: Transition[] = [
  { id: "TR-001", applicationId: "APP-001", officer: "System", department: "Education", timestamp: "2026-09-15T09:00:00", reason: "Application received", oldStatus: "-", newStatus: "Submitted" },
  { id: "TR-002", applicationId: "APP-001", officer: "S. Desai", department: "Education", timestamp: "2026-09-17T11:20:00", reason: "Basic eligibility verified", oldStatus: "Submitted", newStatus: "Document Verification" },
  { id: "TR-003", applicationId: "APP-002", officer: "System", department: "Housing", timestamp: "2026-08-10T08:10:00", reason: "Application received", oldStatus: "-", newStatus: "Submitted" },
  { id: "TR-004", applicationId: "APP-002", officer: "K. Mehta", department: "Housing", timestamp: "2026-08-12T14:45:00", reason: "Documents verified successfully", oldStatus: "Submitted", newStatus: "Document Verification" },
  { id: "TR-005", applicationId: "APP-002", officer: "R. Patel", department: "Housing", timestamp: "2026-08-15T10:30:00", reason: "Forwarded to department for field check", oldStatus: "Document Verification", newStatus: "Department Verification" },
];

export const mockAlerts = [
  { id: 'ALT-1', type: 'Duplicate', count: 124, severity: 'High', description: 'Potential duplicate family records identified.' },
  { id: 'ALT-2', type: 'Conflict', count: 85, severity: 'High', description: 'Name mismatch between Aadhaar and Ration Card.' },
  { id: 'ALT-3', type: 'Missing', count: 340, severity: 'Medium', description: 'Missing income certificates for active benefits.' },
];
