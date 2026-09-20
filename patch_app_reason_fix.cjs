const fs = require('fs');

let content = fs.readFileSync('src/pages/ApplicationDetail.tsx', 'utf8');

// Fix the useState
content = content.replace("useState('{rejectReason}');", "useState('Income exceeds the scheme threshold based on recent PDS data.');");

// Fix the JSX
content = content.replace("<p className=\"text-sm text-red-700 mb-3\">Income exceeds the scheme threshold based on recent PDS data.</p>", "<p className=\"text-sm text-red-700 mb-3\">{rejectReason}</p>");

fs.writeFileSync('src/pages/ApplicationDetail.tsx', content);
