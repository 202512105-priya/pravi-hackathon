import type { Family, FamilyMember, Event } from './mockData';
import { mockFamilies, mockBenefits, mockApplications } from './mockData';
import type { Benefit, Application } from './types';

export interface FamilyAlert {
  id: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  problem: string;
  reason: string;
  action: string;
}

export interface SourceRecord {
  system: string;
  lastSync: string;
  data: Record<string, string>;
}

export interface DetailedFamily extends Family {
  lastVerified: string;
  benefits: Benefit[];
  applications: Application[];
  alerts: FamilyAlert[];
  familyEvents: Event[];
  sourceRecords: SourceRecord[];
}

const members: FamilyMember[] = [
  { id: 'M-101', name: 'Ravi Sharma', age: 45, gender: 'M', relation: 'Head', aadhaarRef: 'AADHAAR_REF_10293' },
  { id: 'M-102', name: 'Meena Sharma', age: 41, gender: 'F', relation: 'Spouse', aadhaarRef: 'AADHAAR_REF_10294' },
  { id: 'M-103', name: 'Arjun Sharma', age: 18, gender: 'M', relation: 'Child', aadhaarRef: 'AADHAAR_REF_10295' },
  { id: 'M-104', name: 'Priya Sharma', age: 14, gender: 'F', relation: 'Child', aadhaarRef: 'AADHAAR_REF_10296' },
  { id: 'M-105', name: 'Kamla Devi', age: 72, gender: 'F', relation: 'Other', aadhaarRef: 'AADHAAR_REF_10297' },
];

export const demoFamilyDetail: DetailedFamily = {
  id: 'GJ-F-10293',
  headName: 'Ravi Sharma',
  district: 'Ahmedabad',
  taluka: 'Sanand',
  village: 'Modasar',
  rationCardStatus: 'Active',
  lastVerified: 'Aug 10, 2026',
  members,
  benefits: mockBenefits.filter(b => b.familyId === 'GJ-F-10293'),
  applications: mockApplications.filter(a => a.familyId === 'GJ-F-10293'),
  alerts: [
    { id: 'A-1', type: 'Stuck Application', severity: 'High', problem: 'Housing Upgrade Grant stuck at Verification.', reason: 'Application waiting for field verification for 42 days.', action: 'Escalate to Taluka Development Officer.' },
    { id: 'A-2', type: 'Verification Delay', severity: 'Medium', problem: 'Arjun Sharma (M-103) eligibility reassessment overdue.', reason: 'Member turned 18, adult verification required.', action: 'Trigger e-KYC prompt to member.' },
    { id: 'A-3', type: 'Data Conflict', severity: 'High', problem: 'Address differs between Family Registry and PDS.', reason: 'Recent PDS update lists "Sector 4" while Registry lists "Sector 2".', action: 'Review and resolve conflicting address.' },
    { id: 'A-4', type: 'Benefit Gap', severity: 'Low', problem: 'Kamla Devi eligible for Widow Pension but suspended.', reason: 'Life certificate missing causing suspension.', action: 'Schedule home visit for life certificate.' }
  ],
  familyEvents: [
    { id: 'E-1', familyId: 'GJ-F-10293', type: 'Alert', description: 'Address conflict detected: PDS address differs from Family Registry', timestamp: 'Sep 20, 2026' },
    { id: 'E-2', familyId: 'GJ-F-10293', type: 'Add', description: 'Application submitted: Education benefit application created', timestamp: 'Sep 15, 2026' },
    { id: 'E-3', familyId: 'GJ-F-10293', type: 'Update', description: 'Member turned 18: Eligibility reassessment triggered', timestamp: 'Sep 05, 2026' },
    { id: 'E-4', familyId: 'GJ-F-10293', type: 'Status', description: 'Benefit received: PDS benefit successfully delivered', timestamp: 'Aug 28, 2026' },
    { id: 'E-5', familyId: 'GJ-F-10293', type: 'Update', description: 'Household verified: Family record verified by e-Gram', timestamp: 'Aug 10, 2026' }
  ],
  sourceRecords: [
    { system: 'Family Registry', lastSync: 'Sep 20, 2026 10:00 AM', data: { 'ID': 'GJ-F-10293', 'Status': 'Active', 'Address': 'Modasar, Sanand, Ahmedabad' } },
    { system: 'PDS', lastSync: 'Sep 19, 2026 02:30 PM', data: { 'Ration Card': 'GJ-RC-8829', 'Address': 'Sector 4, Modasar, Sanand', 'FPS ID': 'FPS-0092' } },
    { system: 'Health', lastSync: 'Sep 10, 2026 09:15 AM', data: { 'PM-JAY ID': 'PMJ-99281', 'Members Covered': '5', 'Status': 'Active' } },
    { system: 'Education', lastSync: 'Sep 15, 2026 11:45 AM', data: { 'Student (M-103)': 'Enrolled (Grade 12)', 'Institution': 'Sanand High School' } },
    { system: 'Pension', lastSync: 'Sep 01, 2026 08:00 AM', data: { 'Pensioner': 'Kamla Devi', 'PPO No': 'PPO-29938', 'Status': 'Active' } },
    { system: 'Housing', lastSync: 'Jun 15, 2026 04:20 PM', data: { 'Application': 'PMAY-G-829', 'Status': 'Pending Verification' } },
    { system: 'WCD', lastSync: 'Jul 20, 2026 10:10 AM', data: { 'Beneficiary': 'Kamla Devi', 'Status': 'Suspended', 'Reason': 'Missing Life Certificate' } }
  ]
};

export function getFamilyDetail(id: string): DetailedFamily | null {
  if (id === 'GJ-F-10293') return demoFamilyDetail;
  
  const baseFamily = mockFamilies.find(f => f.id === id);
  if (!baseFamily) return null;
  
    
  return {
    ...baseFamily,
    lastVerified: 'Sep 01, 2026',
    benefits: mockBenefits.filter(b => b.familyId === id),
    applications: mockApplications.filter(a => a.familyId === id),
    alerts: baseFamily.rationCardStatus === 'Suspended' ? [
      { id: `A-1-${id}`, type: 'Suspended Benefit', severity: 'High', problem: 'Ration card suspended.', reason: 'EKyc pending for household members.', action: 'Initiate e-KYC flow.' }
    ] : [],
    familyEvents: [
      { id: `E-1-${id}`, familyId: id, type: 'Update', description: 'Address updated based on electricity bill', timestamp: '1 day ago' },
      { id: `E-2-${id}`, familyId: id, type: 'Status', description: `Ration card status changed to ${baseFamily.rationCardStatus}`, timestamp: '1 month ago' },
    ],
    sourceRecords: [
      { system: 'Family Registry', lastSync: 'Today 09:00 AM', data: { 'ID': id, 'Status': baseFamily.rationCardStatus || 'Active', 'District': baseFamily.district } },
      { system: 'PDS', lastSync: 'Yesterday 02:00 PM', data: { 'Ration Card': `RC-${id.split('-').pop()}`, 'Status': baseFamily.rationCardStatus || 'Active' } },
    ]
  };
}
