// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

// Import your pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SmartListPage from './pages/SmartListPage';
import SnapCheckoutPage from './pages/SnapCheckoutPage';
import WallyAIPage from './pages/WallyAIPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

// Import the new AuthenticatedLayout
import AuthenticatedLayout from './components/AuthenticatedLayout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public route for login */}
            <Route path="/login" element={<LoginPage />} />

            {/* All authenticated routes as children of AuthenticatedLayout */}
            <Route path="/" element={<AuthenticatedLayout />}>
              {/* Default route for / */}
              <Route index element={<HomePage />} />
              <Route path="smart-list" element={<SmartListPage />} />
              <Route path="snap-checkout" element={<SnapCheckoutPage />} />
              <Route path="wally-ai" element={<WallyAIPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback for any unmatched routes */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
