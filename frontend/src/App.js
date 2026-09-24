import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Login from './Login';
import OwnerDashboard from './OwnerDashboard';
import TrainerDashboard from './TrainerDashboard';
import AgentDashboard from './AgentDashboard';
import SupervisorDashboard from './SupervisorDashboard';
import AllEvaluations from './AllEvaluations';
import PendingCoaching from './PendingCoaching';
import SpotChecksAudits from './SpotChecksAudits';
import VivaManagement from './VivaManagement';
import SessionsManagement from './SessionsManagement';
import Reports from './Reports';
import ActivityLog from './ActivityLog';
import AdminPanel from './AdminPanel';
import TeamPerformance from './TeamPerformance';
import QAPerformance from './QAPerformance';
import EvaluationsOverview from './EvaluationsOverview';
import CoachingMonitor from './CoachingMonitor';
import SpotChecksOverview from './SpotChecksOverview';
import VivaOverview from './VivaOverview';
import SessionsOverview from './SessionsOverview';
import ReportsCenter from './ReportsCenter';
import TargetsGoals from './TargetsGoals';
import MyEvaluations from './MyEvaluations';
import MyCoaching from './MyCoaching';
import MySessions from './MySessions';
import MyPerformance from './MyPerformance';
import QADashboard from './QADashboard';
import QAMyEvaluations from './QAMyEvaluations';
import QACreateEvaluation from './QACreateEvaluation';
import QAPendingCoaching from './QAPendingCoaching';
import QASpotChecks from './QASpotChecks';
import QAViva from './QAViva';
import QASessions from './QASessions';
import QAReports from './QAReports';
import TeamLeadDashboard from './TeamLeadDashboard';
import TLEvaluations from './TLEvaluations';
import TLCoachingMonitor from './TLCoachingMonitor';
import TLSpotChecks from './TLSpotChecks';
import TLVivaOverview from './TLVivaOverview';
import TLSessionsOverview from './TLSessionsOverview';
import TLReports from './TLReports';
import TLTipOfDay from './TLTipOfDay';
import TLDataImport from './TLDataImport';
import ActionPlan2026 from './ActionPlan2026';

function App() {
  const [user, setUser]             = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode]     = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.body.style.background = darkMode ? '#0D0F1E' : '#F0F2F7';
  }, [darkMode]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Normalize role to lowercase on load too
        parsed.role = parsed.role?.toLowerCase();
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    // Normalize role to lowercase so 'Owner', 'OWNER', 'owner' all match
    const normalized = { ...userData, role: userData.role?.toLowerCase() };
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (!user) return null;
    const role = user.role?.toLowerCase();

    switch (currentPage) {
      // ── DASHBOARD (all roles) ──
      case 'dashboard':
        if (role === 'owner')      return <OwnerDashboard />;
        if (role === 'trainer')    return <TrainerDashboard user={user} />;
        if (role === 'agent')      return <AgentDashboard user={user} />;
        if (role === 'supervisor') return <SupervisorDashboard user={user} />;
        if (role === 'qa')         return <QADashboard user={user} />;
        if (role === 'teamlead')   return <TeamLeadDashboard user={user} />;
        return <div style={notFoundStyle}>No dashboard for role: {user.role}</div>;

      // ── OWNER ──
      case 'all-evaluations':   return <AllEvaluations />;
      case 'pending-coaching':  return <PendingCoaching />;
      case 'spot-checks':       return <SpotChecksAudits />;
      case 'viva':              return <VivaManagement />;
      case 'sessions':          return <SessionsManagement />;
      case 'reports':           return <Reports />;
      case 'activity-log':      return <ActivityLog />;
      case 'admin-panel':       return <AdminPanel />;

      // ── SUPERVISOR ──
      case 'team-performance':      return <TeamPerformance />;
      case 'qa-performance':        return <QAPerformance />;
      case 'evaluations-overview':  return <EvaluationsOverview />;
      case 'coaching-monitor':      return <CoachingMonitor />;
      case 'spotchecks-overview':   return <SpotChecksOverview />;
      case 'viva-overview':         return <VivaOverview />;
      case 'sessions-overview':     return <SessionsOverview />;
      case 'reports-center':        return <ReportsCenter />;
      case 'targets-goals':         return <TargetsGoals />;

      // ── AGENT ──
      case 'my-evaluations':  return <MyEvaluations user={user} />;
      case 'my-coaching':     return <MyCoaching user={user} />;
      case 'my-sessions':     return <MySessions user={user} />;
      case 'my-performance':  return <MyPerformance user={user} />;

      // ── QA OFFICER ──
      case 'qa-my-evaluations':     return <QAMyEvaluations user={user} />;
      case 'qa-create-evaluation':  return <QACreateEvaluation user={user} />;
      case 'qa-pending-coaching':   return <QAPendingCoaching user={user} />;
      case 'qa-spot-checks':        return <QASpotChecks user={user} />;
      case 'qa-viva':               return <QAViva user={user} />;
      case 'qa-sessions':           return <QASessions user={user} />;
      case 'qa-reports':            return <QAReports user={user} />;

      // ── QA TEAM LEAD ──
      case 'tl-evaluations':   return <TLEvaluations user={user} />;
      case 'tl-coaching':      return <TLCoachingMonitor user={user} />;
      case 'tl-spot-checks':   return <TLSpotChecks user={user} />;
      case 'tl-viva':          return <TLVivaOverview user={user} />;
      case 'tl-sessions':      return <TLSessionsOverview user={user} />;
      case 'tl-reports':       return <TLReports user={user} />;
      case 'tl-tip-of-day':    return <TLTipOfDay user={user} />;
      case 'tl-data-import':   return <TLDataImport user={user} />;

      // ── ACTION PLAN 2026 (QA Officer + TL + Supervisor) ──
      case 'action-plan': return <ActionPlan2026 user={user} />;

      default:
        return (
          <div style={notFoundStyle}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>Page not found</div>
            <div style={{ fontSize: 13, color: '#8FA3C4' }}>"{currentPage}" doesn't exist</div>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{ marginTop: 24, padding: '10px 24px', background: 'linear-gradient(135deg,#FF6B35,#FF9F1C)', border: 'none', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: darkMode ? '#0D0F1E' : '#F0F2F7', transition:'background 0.3s' }}>
      {/*
        Sidebar renders two things in a fragment:
          1. The fixed sidebar panel
          2. A spacer div that takes up the same width — pushes content right automatically
        No need for marginLeft here.
      */}
      <Sidebar
        userRole={user.role?.toLowerCase()}
        userName={user.name}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(d => !d)}
        badges={{
          'pending-coaching':      0,
          'qa-pending-coaching':   0,
        }}
      />

      {/* Main content — flex: 1 fills remaining width after spacer */}
      <div style={{ flex: 1, minHeight: '100vh', minWidth: 0, background: darkMode ? '#0D0F1E' : '#F0F2F7', transition:'background 0.3s' }}>
        {renderPage()}
      </div>
    </div>
  );
}

const notFoundStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: '#0D0F1E',
  fontFamily: "'Inter','Segoe UI',sans-serif",
  color: '#8FA3C4',
};

export default App;