import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockFamilies } from '../../data/mockData';

export function DashboardHeader() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/families/${searchTerm.trim()}`);
    }
  };

  const filteredFamilies = mockFamilies.filter(f => 
    f.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.headName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-primary">Officer Dashboard</h1>
        <p className="text-slate-500 text-sm">Operational view of families, cases, and benefits.</p>
      </div>

      <div className="relative w-full md:w-96">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Family ID or Name..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
          </div>
        </form>

        {isFocused && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {filteredFamilies.length > 0 ? (
              <ul className="py-1">
                {filteredFamilies.map(f => (
                  <li key={f.id}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                      onClick={() => navigate(`/families/${f.id}`)}
                    >
                      <span className="font-semibold text-primary block">{f.id}</span>
                      <span className="text-slate-500">{f.headName} • {f.district}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                No families found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
