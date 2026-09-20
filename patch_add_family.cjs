const fs = require('fs');

let content = fs.readFileSync('src/pages/Pages.tsx', 'utf8');

const modalHtml = `import { useState, useEffect } from 'react';
import { mockFamilies } from '../data/mockData';
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

`;

content = content.replace("import { useState, useEffect } from 'react';\nimport { mockFamilies } from '../data/mockData';\nimport { useAuth } from '../contexts/AuthContext';", modalHtml);

const familiesReplacement = `export function Families() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <AddFamilyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={(newFam: any) => navigate(\`/families/\${newFam.id}\`)} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Family Directory</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">
          Add New Family
        </button>
      </div>`;

content = content.replace(/export function Families\(\) \{[\s\S]*?Add New Family\n        <\/button>\n      <\/div>/, familiesReplacement);

fs.writeFileSync('src/pages/Pages.tsx', content);
