const fs = require('fs');

let content = fs.readFileSync('src/pages/FamilyDetail.tsx', 'utf8');

// Inject useAuth
content = content.replace("import { apiClient } from '../api/client';", "import { apiClient } from '../api/client';\nimport { useAuth } from '../contexts/AuthContext';");

// Use hook
content = content.replace("export function FamilyDetail() {", "export function FamilyDetail() {\n  const { hasRole } = useAuth();");

// Pass hasRole down
content = content.replace("<FamilyHeader family={family} />", "<FamilyHeader family={family} canEdit={!hasRole(['AUDITOR'])} />");
content = content.replace("<AttentionRequired family={family} />", "<AttentionRequired family={family} canEdit={!hasRole(['AUDITOR'])} />");

// Update Component signatures
content = content.replace("function FamilyHeader({ family }: { family: DetailedFamily }) {", "function FamilyHeader({ family, canEdit = true }: { family: DetailedFamily, canEdit?: boolean }) {");
content = content.replace("function AttentionRequired({ family }: { family: DetailedFamily }) {", "function AttentionRequired({ family, canEdit = true }: { family: DetailedFamily, canEdit?: boolean }) {");

// Hide buttons
content = content.replace(`<div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition text-sm">
            Create Review Task
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg font-medium transition text-sm">
            Report Event
          </button>
        </div>`, `{canEdit && (<div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition text-sm">
            Create Review Task
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg font-medium transition text-sm">
            Report Event
          </button>
        </div>)}`);
        
content = content.replace(`<button className="w-full mt-2 py-2 bg-white border border-red-200 text-red-700 text-sm font-semibold rounded hover:bg-red-50 transition">
          Resolve Issues
        </button>`, `{canEdit && (<button className="w-full mt-2 py-2 bg-white border border-red-200 text-red-700 text-sm font-semibold rounded hover:bg-red-50 transition">
          Resolve Issues
        </button>)}`);

fs.writeFileSync('src/pages/FamilyDetail.tsx', content);
