const fs = require('fs');

let mockDataTs = fs.readFileSync('src/data/mockData.ts', 'utf8');
// Fix genders
mockDataTs = mockDataTs.replace(/"gender": "Male"/g, '"gender": "M"');
mockDataTs = mockDataTs.replace(/"gender": "Female"/g, '"gender": "F"');

// Benefit status, looks like "Active" is not in BenefitStatus.
// Let's check what it expects, earlier we had "Completed", "Verification Pending", "Rejected", "Disbursed".
mockDataTs = mockDataTs.replace(/"status": "Active"/g, '"status": "Disbursed"');

fs.writeFileSync('src/data/mockData.ts', mockDataTs);
