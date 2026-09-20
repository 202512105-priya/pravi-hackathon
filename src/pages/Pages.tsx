import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AddFamilyModal({ isOpen, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    head_name: '', district: 'Ahmedabad', taluka: 'Sanand', village: 'Modasar',
    pincode: '382220', address: '', ration_card_type: 'BPL', annual_income: 50000
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newFam = await apiClient.post('/families', formData, false);
      onSuccess(newFam);
    } catch (err) {
      alert("Failed to create family.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Register New Family</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Head of Household Name</label>
            <input required type="text" value={formData.head_name} onChange={e => setFormData({...formData, head_name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Ramesh Patel" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">District</label>
              <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
                <option>Ahmedabad</option><option>Surat</option><option>Rajkot</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Taluka</label>
              <input required type="text" value={formData.taluka} onChange={e => setFormData({...formData, taluka: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Address</label>
            <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" rows={2}></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-blue-800 rounded-lg transition disabled:opacity-50">
              {loading ? 'Registering...' : 'Create Family Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


import { KPIGrid } from '../components/dashboard/KPIGrid';
import { ApplicationBottleneckChart } from '../components/dashboard/ApplicationBottleneckChart';
import { CasesAttentionTable } from '../components/dashboard/CasesAttentionTable';
import { DistrictBenefitCoverage } from '../components/dashboard/DistrictBenefitCoverage';
import { RecentEvents } from '../components/dashboard/RecentEvents';
import { DataQualityAlerts } from '../components/dashboard/DataQualityAlerts';

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, hasRole } = useAuth();

  useEffect(() => {
    // Simulate loading delay for realism
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isStateLevel = hasRole(['STATE_ADMIN', 'AUDITOR']);
  const isDistrict = hasRole(['DISTRICT_OFFICER']);
  const isDept = hasRole(['DEPARTMENT_OFFICER']);
  const isField = hasRole(['FIELD_WORKER']);

  return (
    <div className="pb-8">
      {/* 
        We pass down the user context to header. Since we don't want to rewrite all child components,
        we can wrap DashboardHeader to dynamically replace its static title for now.
      */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-1">
          Welcome back, {user?.username || 'Officer'}
        </h1>
        <p className="text-slate-500">
          {isStateLevel && "Here's the statewide operations overview."}
          {isDistrict && `Here's the operational overview for ${user?.district} District.`}
          {isDept && `Here's the scheme status for the ${user?.department} Department.`}
          {isField && `Here are your priority tasks for ${user?.taluka} Taluka.`}
        </p>
      </div>
      
      {(isStateLevel || isDistrict || isDept) && <KPIGrid isLoading={isLoading} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {(isStateLevel || isDept) && (
          <div className="lg:col-span-2">
            <ApplicationBottleneckChart isLoading={isLoading} />
          </div>
        )}
        {(isStateLevel || isDistrict) && (
          <div className={isDept ? "lg:col-span-1" : "lg:col-span-3"}>
            <DistrictBenefitCoverage isLoading={isLoading} />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={(isStateLevel || isDistrict) ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          {(isStateLevel || isDistrict || isField) && <CasesAttentionTable isLoading={isLoading} />}
          {(isStateLevel || isDistrict || isField) && <RecentEvents isLoading={isLoading} />}
        </div>
        
        {(isStateLevel || isDistrict) && (
          <div>
            <DataQualityAlerts isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
}



export function Families() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient.get('/families');
        setFamilies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <AddFamilyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={(newFam: any) => navigate(`/families/${newFam.id}`)} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Family Directory</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">
          Add New Family
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading families from database...</div>
        ) : (
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Family ID</th>
              <th className="px-6 py-4 font-medium">Head Name</th>
              <th className="px-6 py-4 font-medium">District</th>
              <th className="px-6 py-4 font-medium">Ration Card</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {families.map((fam) => (
              <tr key={fam.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-primary">{fam.id}</td>
                <td className="px-6 py-4">{fam.head_name}</td>
                <td className="px-6 py-4">{fam.district}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    fam.ration_card_status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {fam.ration_card_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <a href={`/families/${fam.id}`} className="text-primary hover:underline">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full text-slate-500">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p>This module is under construction.</p>
      </div>
    </div>
  );
}
