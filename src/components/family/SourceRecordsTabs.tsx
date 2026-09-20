import { useState } from 'react';
import type { DetailedFamily } from "../../data/familyDetailMock";
import { Card } from '../common/Card';
import { Database } from 'lucide-react';

export function SourceRecordsTabs({ family }: { family: DetailedFamily }) {
  const [activeTab, setActiveTab] = useState(family.sourceRecords[0].system);
  
  const activeRecord = family.sourceRecords.find(r => r.system === activeTab);

  return (
    <Card className="mb-6">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Database className="w-5 h-5 text-slate-500" />
          Linked Source Records
        </h3>
        {activeRecord && (
          <span className="text-xs text-slate-500">
            Last synchronized: <span className="font-medium">{activeRecord.lastSync}</span>
          </span>
        )}
      </div>
      
      <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
        {family.sourceRecords.map(record => (
          <button
            key={record.system}
            onClick={() => setActiveTab(record.system)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === record.system 
                ? 'border-primary text-primary bg-blue-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {record.system}
          </button>
        ))}
      </div>
      
      <div className="p-5 bg-slate-900 text-green-400 font-mono text-sm overflow-x-auto rounded-b-xl rounded-t-none">
        {activeRecord ? (
          <pre>
            {JSON.stringify(activeRecord.data, null, 2)}
          </pre>
        ) : (
          <div className="text-slate-500">No data available from this source.</div>
        )}
      </div>
    </Card>
  );
}
