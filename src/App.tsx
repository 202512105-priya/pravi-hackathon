import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import Layout from './components/Layout';
import { Dashboard, Families, Placeholder } from './pages/Pages';
import { FamilyDetail } from './pages/FamilyDetail';
import { Benefits } from './pages/Benefits';
import { BenefitDetail } from './pages/BenefitDetail';
import { Applications } from './pages/Applications';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { Conflicts } from './pages/Conflicts';
import { ConflictDetail } from './pages/ConflictDetail';
import { Schemes } from './pages/Schemes';
import { SchemeDetail } from './pages/SchemeDetail';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { Analytics } from './pages/Analytics';
import { DistrictAnalytics } from './pages/DistrictAnalytics';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { GuidedDemoProvider, GuidedDemoOverlay } from './components/demo/GuidedDemo';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <GuidedDemoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/my-family" element={<ProtectedRoute><CitizenDashboard /></ProtectedRoute>} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="families" element={<Families />} />
              <Route path="families/:familyId" element={<FamilyDetail />} />
              <Route path="schemes" element={<Schemes />} />
              <Route path="schemes/:schemeId" element={<SchemeDetail />} />
              <Route path="benefits" element={<Benefits />} />
              <Route path="benefits/:benefitId" element={<BenefitDetail />} />
              <Route path="applications" element={<Applications />} />
              <Route path="applications/:applicationId" element={<ApplicationDetail />} />
              <Route path="conflicts" element={<Conflicts />} />
              <Route path="conflicts/:conflictId" element={<ConflictDetail />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:eventId" element={<EventDetail />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="analytics/districts/:districtId" element={<DistrictAnalytics />} />
              <Route path="admin" element={<Placeholder title="Administration" />} />
            </Route>
          </Routes>
          <GuidedDemoOverlay />
        </BrowserRouter>
      </GuidedDemoProvider>
    </AuthProvider>
  );
}

export default App;
