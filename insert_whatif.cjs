const fs = require('fs');

let content = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');

// Ensure lucide icons are imported
if (!content.includes('SlidersHorizontal')) {
  content = content.replace(/import \{ ArrowRight, Activity, FileWarning \} from 'lucide-react';/, "import { ArrowRight, Activity, FileWarning, SlidersHorizontal, UserPlus } from 'lucide-react';");
}

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
                <span className="text-indigo-700">₹{(incomeLimit).toLocaleString()} (Simulated)</span>
              </label>
              <input type="range" min="200000" max="500000" step="10000" value={incomeLimit} onChange={(e) => setIncomeLimit(Number(e.target.value))} className="w-full accent-indigo-600" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Current: ₹2,00,000</span>
                <span>Max: ₹5,00,000</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm text-center">
            <UserPlus className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <h3 className="text-3xl font-black text-slate-800">{projectedFamilies.toLocaleString()}</h3>
            <p className="text-sm font-medium text-slate-500 mb-4">Newly Eligible Families</p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition shadow-sm">
              Create Outreach Tasks
            </button>
          </div>
        </div>
      </div>
`;

content = content.replace(/<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">/, whatIfTool + '\n      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">');
fs.writeFileSync('src/pages/Analytics.tsx', content);
