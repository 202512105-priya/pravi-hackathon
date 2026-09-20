import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { kpiData } from '../../data/mockData';

interface KPIGridProps {
  isLoading?: boolean;
}

export function KPIGrid({ isLoading }: KPIGridProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  const formatNumber = (num: number) => new Intl.NumberFormat('en-IN').format(num);

  const kpis = [
    { 
      label: 'Registered Families', 
      value: formatNumber(kpiData.registeredFamilies), 
      desc: 'Total on platform', 
      path: '/families' 
    },
    { 
      label: 'Active Families', 
      value: formatNumber(kpiData.activeFamilies), 
      desc: 'Currently eligible', 
      path: '/families?status=active' 
    },
    { 
      label: 'Receiving Benefits', 
      value: formatNumber(kpiData.receivingBenefits), 
      desc: 'Active disbursements', 
      path: '/benefits' 
    },
    { 
      label: 'Open Reviews', 
      value: formatNumber(kpiData.openReviews), 
      desc: 'Require attention', 
      path: '/conflicts',
      highlight: true
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, idx) => (
        <Card key={idx} onClick={() => navigate(kpi.path)} className="p-5">
          <h3 className="text-slate-500 font-medium text-sm">{kpi.label}</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2 mb-1">{kpi.value}</p>
          <span className={`text-xs font-medium ${kpi.highlight ? 'text-saffron' : 'text-slate-400'}`}>
            {kpi.desc}
          </span>
        </Card>
      ))}
    </div>
  );
}
