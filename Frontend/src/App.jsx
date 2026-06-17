import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Landing         from './pages/Landing.jsx';
import Home            from './pages/Home.jsx';
import History         from './pages/History.jsx';
import KnowYourRights  from './pages/KnowYourRights.jsx';
import DocumentWizard  from './pages/DocumentWizard.jsx';
import ContractAnalyzer from './pages/ContractAnalyzer.jsx';
import Login           from './pages/Login.jsx';
import Register        from './pages/Register.jsx';
import Dashboard       from './pages/Dashboard.jsx';
import MatterDetail    from './pages/MatterDetail.jsx';
import CaseTracker     from './pages/CaseTracker.jsx';
import LawyerDirectory from './pages/LawyerDirectory.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/"        element={<Landing />} />
          <Route path="/chat"    element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/rights"  element={<KnowYourRights />} />
          <Route path="/documents" element={<DocumentWizard />} />
          <Route path="/analyze" element={<ContractAnalyzer />} />
          <Route path="/lawyers" element={<LawyerDirectory />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — require login */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/matters/:id" element={
            <ProtectedRoute><MatterDetail /></ProtectedRoute>
          } />
          <Route path="/tracker" element={
            <ProtectedRoute><CaseTracker /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
