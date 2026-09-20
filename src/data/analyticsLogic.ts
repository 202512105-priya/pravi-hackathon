import { mockFamilies, mockBenefits, mockApplications } from './mockData';
import { mockConflicts } from './conflictMockData';
import { sessionEvents } from './eventLogic';

// Reusable Utilities

export function calculateUniqueFamiliesReceivingBenefits(districtId?: string) {
  const activeStatuses = ["Active", "Completed", "Disbursed", "Received"];
  const benefits = mockBenefits.filter(b => activeStatuses.includes(b.status) && (!districtId || b.district === districtId));
  const uniqueFamilyIds = new Set(benefits.map(b => b.familyId));
  return uniqueFamilyIds.size;
}

export function calculateApplicationFunnel(districtId?: string) {
  const apps = mockApplications.filter(a => !districtId || a.district === districtId);
  const stages = ["Submitted", "Document Verification", "Department Verification", "Approved", "Payment", "Delivered", "Rejected"];
  
  return stages.map(stage => ({
    name: stage,
    count: apps.filter(a => a.currentStage === stage).length
  }));
}

export function calculatePendingByStage(districtId?: string) {
  const pendingStages = ["Submitted", "Document Verification", "Department Verification", "Payment"];
  const apps = mockApplications.filter(a => pendingStages.includes(a.currentStage) && (!districtId || a.district === districtId));
  
  return pendingStages.map(stage => {
    const stageApps = apps.filter(a => a.currentStage === stage);
    const avgDays = stageApps.length ? Math.round(stageApps.reduce((sum, a) => sum + a.pendingDays, 0) / stageApps.length) : 0;
    const maxDays = stageApps.length ? Math.max(...stageApps.map(a => a.pendingDays)) : 0;
    const delayedCount = stageApps.filter(a => a.pendingDays > 30).length;

    return {
      stage,
      count: stageApps.length,
      avgDays,
      maxDays,
      delayedCount
    };
  });
}

export function calculateSchemeVerificationDelay(districtId?: string) {
  const pendingStages = ["Document Verification", "Department Verification"];
  const apps = mockApplications.filter(a => pendingStages.includes(a.currentStage) && (!districtId || a.district === districtId));
  
  const schemeMap = new Map<string, { totalDays: number, count: number }>();
  
  apps.forEach(a => {
    if (!schemeMap.has(a.schemeName)) schemeMap.set(a.schemeName, { totalDays: 0, count: 0 });
    const s = schemeMap.get(a.schemeName)!;
    s.totalDays += a.pendingDays;
    s.count += 1;
  });

  return Array.from(schemeMap.entries()).map(([schemeName, data]) => ({
    schemeName,
    avgDelay: Math.round(data.totalDays / data.count),
    count: data.count
  })).sort((a, b) => b.avgDelay - a.avgDelay);
}

export interface DistrictAnalytics {
  district: string;
  familiesReceivingBenefits: number;
  activeApplications: number;
  pendingApplications: number;
  delayedApplications: number;
  openConflicts: number;
  potentialBenefitGaps: number;
}

export function calculateDistrictMetrics(): DistrictAnalytics[] {
  const districts = Array.from(new Set(mockFamilies.map(f => f.district)));
  
  return districts.map(district => {
    const pendingStages = ["Submitted", "Document Verification", "Department Verification", "Payment"];
    const dApps = mockApplications.filter(a => a.district === district);
    
    return {
      district,
      familiesReceivingBenefits: calculateUniqueFamiliesReceivingBenefits(district),
      activeApplications: dApps.length,
      pendingApplications: dApps.filter(a => pendingStages.includes(a.currentStage)).length,
      delayedApplications: dApps.filter(a => a.pendingDays > 30).length,
      openConflicts: mockConflicts.filter(c => c.district === district && c.status === 'OPEN').length,
      potentialBenefitGaps: calculatePotentialBenefitGaps(district).length // Expensive but okay for mock
    };
  });
}

export function calculateConflictCategories(districtId?: string) {
  const conflicts = mockConflicts.filter(c => !districtId || c.district === districtId);
  const categories = ["NAME_MISMATCH", "DOB_MISMATCH", "ADDRESS_MISMATCH", "DUPLICATE_MEMBER", "RELATIONSHIP_MISMATCH"];
  
  return categories.map(type => ({
    name: type.replace('_', ' '),
    count: conflicts.filter(c => c.type === type).length,
    originalType: type
  })).sort((a, b) => b.count - a.count);
}

export function calculateFamiliesWithMultipleIssues(districtId?: string) {
  const families = mockFamilies.filter(f => !districtId || f.district === districtId);
  
  const issues = families.map(f => {
    const openApps = mockApplications.filter(a => a.familyId === f.id && a.currentStage !== 'Delivered' && a.currentStage !== 'Rejected').length;
    const openConfs = mockConflicts.filter(c => c.familyId === f.id && ['OPEN', 'UNDER_REVIEW'].includes(c.status)).length;
    const reviewBens = sessionEvents.filter(e => e.familyId === f.id && e.status === 'REVIEW_REQUIRED').length;
    
    return {
      familyId: f.id,
      district: f.district,
      openApps,
      openConfs,
      reviewBens,
      totalIssues: openApps + openConfs + reviewBens
    };
  });

  return issues.filter(i => i.totalIssues > 0).sort((a, b) => b.totalIssues - a.totalIssues);
}

export function calculatePotentialBenefitGaps(districtId?: string) {
  const families = mockFamilies.filter(f => !districtId || f.district === districtId);
  const gaps: any[] = [];

  // Deterministic Mock Rule: If family has a member > 60 years old but no Pension benefit
  families.forEach(f => {
    f.members.forEach(m => {
      if (m.age >= 60) {
        const hasPension = mockBenefits.some(b => b.familyId === f.id && b.beneficiaryMemberId === m.id && b.department === 'Pension');
        const hasPensionApp = mockApplications.some(a => a.familyId === f.id && a.beneficiaryMemberId === m.id && a.department === 'Pension');
        
        if (!hasPension && !hasPensionApp) {
          gaps.push({
            familyId: f.id,
            memberId: m.id,
            memberName: m.name,
            schemeName: "Senior Citizen Pension",
            department: "Pension",
            reason: "Potentially relevant senior citizen household member has no active pension application.",
            district: f.district
          });
        }
      }

      if (m.age < 18) {
        const hasEdu = mockBenefits.some(b => b.familyId === f.id && b.beneficiaryMemberId === m.id && b.department === 'Education');
        const hasEduApp = mockApplications.some(a => a.familyId === f.id && a.beneficiaryMemberId === m.id && a.department === 'Education');
        
        if (!hasEdu && !hasEduApp) {
          gaps.push({
            familyId: f.id,
            memberId: m.id,
            memberName: m.name,
            schemeName: "Education Support",
            department: "Education",
            reason: "Potentially relevant school-age member has no active education application.",
            district: f.district
          });
        }
      }
    });
  });

  return gaps;
}

export function calculatePendingTrend(districtId?: string) {
  // Synthetic static trend representing Jun -> Jul -> Aug -> Sep
  // Based on current delayed count in district
  const pendingNow = calculatePendingByStage(districtId).reduce((sum, s) => sum + s.avgDays, 0) / 4 || 35;
  
  return [
    { month: 'Jun', averageDays: Math.max(10, pendingNow - 15) },
    { month: 'Jul', averageDays: Math.max(12, pendingNow - 8) },
    { month: 'Aug', averageDays: Math.max(15, pendingNow - 3) },
    { month: 'Sep', averageDays: Math.round(pendingNow) }
  ];
}
