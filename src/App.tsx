import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SmartListPage from './pages/SmartListPage';
import SnapCheckoutPage from './pages/SnapCheckoutPage';
import WallyAIPage from './pages/WallyAIPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import Navigation from './components/Navigation';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0071ce] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading SmartCart+...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'smartlist': return <SmartListPage />;
      case 'snap': return <SnapCheckoutPage />;
      case 'assistant': return <WallyAIPage />;
      case 'orders': return <OrdersPage />;
      case 'profile': return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  return (
    <>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;