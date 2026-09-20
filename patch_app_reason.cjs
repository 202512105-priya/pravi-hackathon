const fs = require('fs');

let content = fs.readFileSync('src/pages/ApplicationDetail.tsx', 'utf8');

const statusLogic = `  const updateStatus = async (newStatus: string) => {
    let reason = '';
    if (newStatus === 'Rejected') {
      const input = prompt("Please enter the reason for rejection:");
      if (input === null) return; // User cancelled prompt
      reason = input;
    }
    try {
      await apiClient.patch(\`/applications/\${applicationId}/status?status=\${encodeURIComponent(newStatus)}\`, { status: newStatus, reason });
      setRejectReason(reason);
      loadApp();
    } catch (err) {
      alert("Failed to update status");
    }
  };`;

content = content.replace(/  const updateStatus = async \(newStatus: string\) => \{[\s\S]*?  \};/, statusLogic);

// Need to track rejectReason state
content = content.replace("const [loading, setLoading] = useState(true);", "const [loading, setLoading] = useState(true);\n  const [rejectReason, setRejectReason] = useState('Income exceeds the scheme threshold based on recent PDS data.');");

// Show actual reason
content = content.replace("Income exceeds the scheme threshold based on recent PDS data.", "{rejectReason}");

fs.writeFileSync('src/pages/ApplicationDetail.tsx', content);
