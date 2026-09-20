import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { mockCases } from '../../data/mockData';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

export function CasesAttentionTable({ isLoading }: { isLoading?: boolean }) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Cases Requiring Attention</h3>
        <button onClick={() => navigate('/conflicts')} className="text-primary text-sm font-medium hover:underline">View All</button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-5 space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : mockCases.length === 0 ? (
          <EmptyState title="No active cases" description="All clear! No cases require your immediate attention." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 sticky top-0">
              <tr>
                <th className="px-5 py-3 font-medium">Family ID</th>
                <th className="px-5 py-3 font-medium">Problem</th>
                <th className="px-5 py-3 font-medium">Pending</th>
                <th className="px-5 py-3 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCases.map((c) => (
                <tr 
                  key={c.id} 
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/conflicts`)}
                >
                  <td className="px-5 py-3 font-medium text-primary">{c.familyId}</td>
                  <td className="px-5 py-3 text-slate-600 truncate max-w-xs">{c.problem}</td>
                  <td className="px-5 py-3 text-slate-500">{c.pendingDays}d</td>
                  <td className="px-5 py-3">
                    <Badge variant={c.priority}>{c.priority}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
