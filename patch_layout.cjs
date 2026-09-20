const fs = require('fs');

let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const importReplacement = `import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';`;
content = content.replace("import { Outlet, Link, useLocation } from 'react-router-dom';", importReplacement);

const hookReplacement = `export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };`;
content = content.replace("export default function Layout() {\n  const location = useLocation();", hookReplacement);

const profileReplacement = `<div className="flex items-center gap-2 border-l pl-4 cursor-pointer hover:bg-slate-50 p-1 rounded transition" onClick={handleLogout} title="Click to logout">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-700">{user?.username || 'Gov Officer'}</p>
                <p className="text-xs text-slate-500">{user?.role || 'State Admin'}</p>
              </div>
            </div>`;
            
const oldProfile = `<div className="flex items-center gap-2 border-l pl-4">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-700">Gov Officer</p>
                <p className="text-xs text-slate-500">State Admin</p>
              </div>
            </div>`;

content = content.replace(oldProfile, profileReplacement);

fs.writeFileSync('src/components/Layout.tsx', content);
