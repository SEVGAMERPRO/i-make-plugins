import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PluginsPage from './pages/PluginsPage';
import GamePage from './pages/GamePage';
import PluginDetailPage from './pages/PluginDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import CreatorDashboard from './pages/CreatorDashboard';
import UploadPluginPage from './pages/UploadPluginPage';
import BountiesPage from './pages/BountiesPage';
import AiConfigPage from './pages/AiConfigPage';
import StaffReviewPage from './pages/StaffReviewPage';
import PricingPage from './pages/PricingPage';
import AdsManagerPage from './pages/AdsManagerPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/plugins" element={<PluginsPage />} />
        <Route path="/plugins/:id" element={<PluginDetailPage />} />
        <Route path="/games/:slug" element={<GamePage />} />
        <Route path="/bounties" element={<BountiesPage />} />
        <Route path="/ai-config" element={<AiConfigPage />} />
        <Route path="/ads" element={<AdsManagerPage />} />
        <Route path="/upgrade" element={<PricingPage />} />
        <Route path="/membership" element={<PricingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/dashboard" element={<CreatorDashboard />} />
        <Route path="/my-plugins" element={<CreatorDashboard />} />
        <Route path="/upload" element={<UploadPluginPage />} />
        <Route path="/staff/reviews" element={<StaffReviewPage />} />
        <Route path="/users/:username" element={<UserProfilePage />} />
        
        {/* 404 Fallback */}
        <Route path="*" element={<div className="flex-grow flex items-center justify-center text-2xl font-bold text-slate-400 bg-[#0b0f19]">404 - Page Not Found</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
