import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ClockInterface } from './components/ClockInterface';
import { Timesheet } from './components/Timesheet';
import { MyTeam } from './components/MyTeam';
import { LeaveApplicationList } from './components/LeaveApplicationList';

function AppContent() {
  const { messUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'clock' | 'timesheet' | 'team' | 'leave'>('clock');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!messUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'clock' && <ClockInterface />}
        {activeTab === 'timesheet' && <Timesheet />}
        {activeTab === 'team' && <MyTeam />}
        {activeTab === 'leave' && <LeaveApplicationList />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
