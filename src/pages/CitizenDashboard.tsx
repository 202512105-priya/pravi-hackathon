import { useAuth } from '../contexts/AuthContext';
import { FamilyDetail } from './FamilyDetail';
import { Users, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CitizenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user || user.role !== 'CITIZEN' || !user.linked_family_id) {
    return <div className="p-8 text-center text-red-500">Unauthorized Citizen Access</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-indigo-700 text-white flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-3 font-bold text-xl">
          <Users className="w-8 h-8 text-indigo-200" />
          <span>Gujarat Parivar Pehchan <span className="font-normal text-indigo-300 text-sm ml-2 hidden sm:inline">| Citizen Services Portal</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user.username}</p>
            <p className="text-xs text-indigo-200">Family ID: {user.linked_family_id}</p>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-indigo-600 rounded-lg transition" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg mb-6 text-indigo-800 text-sm">
            <strong>Welcome back!</strong> This is your official household registry record. 
            From here, you can view your verified members, track scheme applications, and challenge any rejected benefits.
          </div>
          
          {/* We reuse the FamilyDetail component but the internal RBAC !hasRole(['AUDITOR']) 
              and we can also add !hasRole(['CITIZEN']) inside FamilyDetail for officer buttons */}
          <FamilyDetail overrideFamilyId={user.linked_family_id} />
        </div>
      </main>
    </div>
  );
}
