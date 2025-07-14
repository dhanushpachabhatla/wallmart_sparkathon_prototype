// src/components/AuthenticatedLayout.tsx (Corrected)
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';

const AuthenticatedLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, isLoading, navigate, location.pathname]);

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
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Remains fixed */}
      <Navigation />

      {/* Main content area - This is the container for all pages rendered via <Outlet /> */}
      {/* It needs left padding equal to the sidebar's width. */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-20 lg:pb-8 **lg:pl-64**"> {/* <-- ENSURE THIS IS lg:pl-64 */}
        <Outlet /> {/* This is where HomePage, WallyAIPage, etc., will be rendered */}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;