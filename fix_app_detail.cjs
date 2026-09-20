const fs = require('fs');

let content = fs.readFileSync('src/pages/ApplicationDetail.tsx', 'utf8');

const missingBlock = `        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Application</span>
            <span className="text-slate-800 font-medium">{app.id}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Family</span>
            <Link to={\`/families/\${app.familyId}\`} className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              {app.familyId} 
            </Link>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Member</span>
            <span className="text-slate-800 font-medium">{app.beneficiaryMemberId}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Current Stage</span>
            <span className="text-slate-800 font-medium">{app.currentStage}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Pending</span>
            <span className={\`font-medium \${app.pendingDays >= 30 ? 'text-red-600' : 'text-slate-800'}\`}>{app.pendingDays} days</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Overall Status</span>
            <span className={\`px-2 py-1 rounded text-xs font-bold \${app.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}\`}>{app.status}</span>
          </div>
          
          {app.currentStage === 'Rejected' && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg col-span-full">
              <h3 className="text-red-800 font-bold mb-1">Rejection Reason</h3>
              <p className="text-sm text-red-700 mb-3">{rejectReason}</p>
              <button className="px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-semibold rounded hover:bg-red-50 transition shadow-sm">
                Initiate Appeal / Challenge
              </button>
            </div>
          )}
        </div>`;

content = content.replace(/<\/div>\n      <\/div>\n\n      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">/, '</div>\n        ' + missingBlock + '\n      </div>\n\n      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">');

fs.writeFileSync('src/pages/ApplicationDetail.tsx', content);
