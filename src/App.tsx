// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

// Import your pages (now they don't need direct import here if only accessed via Outlet)
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
            {/* Public route for login. This route should NOT be inside AuthenticatedLayout */}
            <Route path="/login" element={<LoginPage />} />

            {/* All authenticated routes will be children of AuthenticatedLayout */}
            <Route path="/" element={<AuthenticatedLayout />}>
              {/* These are the routes that will render within the <Outlet> of AuthenticatedLayout */}
              <Route index element={<HomePage />} /> {/* default route for / */}
              <Route path="/smart-list" element={<SmartListPage />} />
              <Route path="/snap-checkout" element={<SnapCheckoutPage />} />
              <Route path="/wally-ai" element={<WallyAIPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
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