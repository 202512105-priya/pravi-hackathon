const fs = require('fs');

let content = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');

// Add useState
content = content.replace("import { SlidersHorizontal, UserPlus } from 'lucide-react';", "import { SlidersHorizontal, UserPlus } from 'lucide-react';\nimport { useState } from 'react';");

// Inside Analytics()
content = content.replace("export function Analytics() {", "export function Analytics() {\n  const [incomeLimit, setIncomeLimit] = useState(300000);\n  const projectedFamilies = Math.floor((incomeLimit - 200000) / 1000 * 45) + 121;");

// Update the slider UI
const sliderHtml = `              <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                <span>Scheme Income Limit (₹)</span>
                <span className="text-indigo-700">₹{(incomeLimit).toLocaleString()} (Simulated)</span>
              </label>
              <input type="range" min="200000" max="500000" step="10000" value={incomeLimit} onChange={(e) => setIncomeLimit(Number(e.target.value))} className="w-full accent-indigo-600" />`;

content = content.replace(/<label className="flex justify-between text-sm font-bold text-slate-700 mb-2">[\s\S]*?accent-indigo-600" \/>/, sliderHtml);

// Update the projected number
content = content.replace('<h3 className="text-3xl font-black text-slate-800">4,521</h3>', '<h3 className="text-3xl font-black text-slate-800">{projectedFamilies.toLocaleString()}</h3>');

fs.writeFileSync('src/pages/Analytics.tsx', content);
