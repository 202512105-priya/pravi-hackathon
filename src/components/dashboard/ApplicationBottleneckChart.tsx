import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../common/Card';
import { applicationStages } from '../../data/mockData';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

interface ChartProps {
  isLoading?: boolean;
}

export function ApplicationBottleneckChart({ isLoading }: ChartProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-5 h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Application Bottlenecks</h3>
      
      {isLoading ? (
        <div className="flex-1 flex items-end gap-4 pb-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="w-full" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
          ))}
        </div>
      ) : applicationStages.length === 0 ? (
        <EmptyState title="No Applications" description="There are no applications currently in the pipeline." />
      ) : (
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={applicationStages}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              onClick={(state: any) => {
                if (state && state.activePayload) {
                  const stage = state.activePayload[0].payload.name;
                  navigate(`/applications?stage=${stage.toLowerCase()}`);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} cursor="pointer">
                {applicationStages.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#ea580c' : '#1e3a8a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
