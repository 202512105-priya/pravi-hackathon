const fs = require('fs');
let mockDataTs = fs.readFileSync('src/data/mockData.ts', 'utf8');

const newType = `export interface Family {
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
}`;

mockDataTs = mockDataTs.replace(/export interface Family \{[\s\S]*?members: FamilyMember\[\];\n\}/, newType);

fs.writeFileSync('src/data/mockData.ts', mockDataTs);
