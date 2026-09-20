const fs = require('fs');

// Change 2: ApplicationDetail (Clear reasons & challenge)
let appDetail = fs.readFileSync('src/pages/ApplicationDetail.tsx', 'utf8');
const rejectUI = `{app.currentStage === 'Rejected' && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <h3 className="text-red-800 font-bold mb-1">Rejection Reason</h3>
              <p className="text-sm text-red-700 mb-3">Income exceeds the scheme threshold based on recent PDS data.</p>
              <button className="px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-semibold rounded hover:bg-red-50 transition shadow-sm">
                Initiate Appeal / Challenge
              </button>
            </div>
          )}`;
appDetail = appDetail.replace(/<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">/, rejectUI + '\n        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-6">');
fs.writeFileSync('src/pages/ApplicationDetail.tsx', appDetail);

// Change 3: BenefitLedger in FamilyDetail (Paid vs Received)
let familyDetail = fs.readFileSync('src/pages/FamilyDetail.tsx', 'utf8');
const benefitLedgerHtml = `<th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Paid (Sent)</th>
              <th className="px-5 py-3 font-medium">Received</th>
              <th className="px-5 py-3 font-medium">Alert</th>`;
familyDetail = familyDetail.replace(/<th className="px-5 py-3 font-medium">Status<\/th>\n              <th className="px-5 py-3 font-medium">Paid Amount<\/th>/, benefitLedgerHtml);

const benefitRow = `<td className="px-5 py-3"><Badge variant={b.status === 'Disbursed' ? 'Success' : 'High'}>{b.status === 'Disbursed' ? 'Received' : 'Sent, Not Received'}</Badge></td>
                <td className="px-5 py-3 font-medium text-slate-700">₹15,000</td>
                <td className="px-5 py-3 font-medium text-slate-700">{b.status === 'Disbursed' ? '₹15,000' : '₹0'}</td>
                <td className="px-5 py-3">
                  {b.status !== 'Disbursed' && <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold hover:bg-red-200">Fix Payment</button>}
                </td>`;
familyDetail = familyDetail.replace(/<td className="px-5 py-3"><Badge variant="Success">\{b\.status\}<\/Badge><\/td>\n                <td className="px-5 py-3 font-medium text-slate-700">\{b\.paidAmount\}<\/td>/g, benefitRow);
fs.writeFileSync('src/pages/FamilyDetail.tsx', familyDetail);

// Change 4: Analytics ("What If" Tool)
let analytics = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');

// Ensure lucide icons are imported
analytics = analytics.replace(/import \{ BarChart,/, "import { SlidersHorizontal, UserPlus } from 'lucide-react';\nimport { BarChart,");

const whatIfTool = `
      {/* What-If Policy Simulator */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Policy Simulator ("What-If" Tool)</h2>
              <p className="text-sm text-slate-500">Test policy changes and instantly generate outreach tasks.</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div className="col-span-2 space-y-6">
            <div>
              <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                <span>Scheme Income Limit (₹)</span>
                <span className="text-indigo-700">₹3,00,000 (Simulated)</span>
              </label>
              <input type="range" min="100000" max="500000" defaultValue="300000" className="w-full accent-indigo-600" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Current: ₹2,00,000</span>
                <span>Max: ₹5,00,000</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm text-center">
            <UserPlus className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <h3 className="text-3xl font-black text-slate-800">4,521</h3>
            <p className="text-sm font-medium text-slate-500 mb-4">Newly Eligible Families</p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition shadow-sm">
              Create Outreach Tasks
            </button>
          </div>
        </div>
      </div>
`;

analytics = analytics.replace(/<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">/, whatIfTool + '\n      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">');
fs.writeFileSync('src/pages/Analytics.tsx', analytics);

