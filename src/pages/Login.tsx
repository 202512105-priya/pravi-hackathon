import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';
import { ShieldCheck } from 'lucide-react';

const DEMO_USERS = [
  { label: 'State Admin', username: 'admin', role: 'STATE_ADMIN' },
  { label: 'Ahmedabad District Officer', username: 'officer_ahmedabad', role: 'DISTRICT_OFFICER' },
  { label: 'Health Department Officer', username: 'health_dept', role: 'DEPARTMENT_OFFICER' },
  { label: 'Field Worker (Sanand)', username: 'field_sanand', role: 'FIELD_WORKER' },
  { label: 'System Auditor', username: 'auditor', role: 'AUDITOR' },
  { label: 'Citizen Portal (Ravi Sharma)', username: 'citizen_ravi', role: 'CITIZEN' }
];

export function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await apiClient.post('/login', {
        username,
        password
      }, true);
      
      login(data.access_token, data.user);
      if (data.user.role === 'CITIZEN') {
        navigate('/my-family');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Family ID 360
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to your officer account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/40 sm:rounded-xl sm:px-10 border border-slate-100">
          
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Fast Demo Login</label>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map(u => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => { setUsername(u.username); setPassword('demo'); }}
                  className={`text-left px-3 py-2 text-sm rounded border \${username === u.username ? 'bg-blue-50 border-blue-200 text-primary font-medium' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between">
                    <span>{u.label}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{u.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <div className="mt-1">
                <input value={username} onChange={e => setUsername(e.target.value)} required className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                {loading ? 'Authenticating...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
