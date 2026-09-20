const fs = require('fs');
let mockDataTs = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Fix Family status
mockDataTs = mockDataTs.replace(/"status": "Disbursed",\n    "district"/g, '"householdStatus": "Active",\n    "district"');

fs.writeFileSync('src/data/mockData.ts', mockDataTs);
