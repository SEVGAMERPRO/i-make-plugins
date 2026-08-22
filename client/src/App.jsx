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
        <Route path="/users/:username" element={<UserProfilePage />} />
        
        {/* Fallbacks */}
        <Route path="*" element={<div className="flex-grow flex items-center justify-center text-2xl font-bold text-gray-400">404 - Page Not Found</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
