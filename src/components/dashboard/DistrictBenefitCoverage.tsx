import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import { districtCoverage } from '../../data/mockData';
import { Skeleton } from '../common/Skeleton';

export function DistrictBenefitCoverage({ isLoading }: { isLoading?: boolean }) {
  return (
    <Card className="p-5 h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Benefit Coverage (%)</h3>
      
      {isLoading ? (
        <div className="flex-1 flex items-end gap-4 pb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="w-full" style={{ height: `${Math.max(30, Math.random() * 100)}%` }} />
          ))}
        </div>
      ) : (
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={districtCoverage}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="coverage" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
