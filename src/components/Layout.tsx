import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, Users, HeartHandshake, FileText, 
  AlertTriangle, Calendar, BarChart3, Settings, Search, Bell, User
} from 'lucide-react';
import { districtOptions } from '../data/mockData';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'DEPARTMENT_OFFICER', 'FIELD_WORKER', 'AUDITOR'] },
  { name: 'Families', path: '/families', icon: Users, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'FIELD_WORKER', 'AUDITOR'] },
  { name: 'Schemes', path: '/schemes', icon: FileText, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'DEPARTMENT_OFFICER', 'AUDITOR'] },
  { name: 'Benefits', path: '/benefits', icon: HeartHandshake, roles: ['STATE_ADMIN', 'DEPARTMENT_OFFICER', 'AUDITOR'] },
  { name: 'Applications', path: '/applications', icon: FileText, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'FIELD_WORKER', 'AUDITOR'] },
  { name: 'Conflicts', path: '/conflicts', icon: AlertTriangle, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'AUDITOR'] },
  { name: 'Events', path: '/events', icon: Calendar, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'FIELD_WORKER'] },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'DEPARTMENT_OFFICER'] },
  { name: 'Admin', path: '/admin', icon: Settings, roles: ['STATE_ADMIN'] },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="p-4 flex items-center gap-3 font-bold text-xl border-b border-blue-900">
          <Users className="w-8 h-8 text-saffron" />
          <span>Family ID 360</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {navItems.filter(item => !user || item.roles.includes(user.role)).map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search families, IDs..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg border-none focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <select className="bg-slate-100 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
              <option>All Districts (Gujarat)</option>
              {districtOptions.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-saffron rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 border-l pl-4 cursor-pointer hover:bg-slate-50 p-1 rounded transition" onClick={handleLogout} title="Click to logout">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-700">{user?.username || 'Gov Officer'}</p>
                <p className="text-xs text-slate-500">{user?.role || 'State Admin'}</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
