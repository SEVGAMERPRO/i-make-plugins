import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/cart/CartDrawer';
import PaymentSimulatorModal from './components/cart/PaymentSimulatorModal';

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
import CustomPluginPage from './pages/CustomPluginPage';
import RequestSuccessPage from './pages/RequestSuccessPage';
import BecomeCreatorPage from './pages/BecomeCreatorPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NetworkPortalPage from './pages/NetworkPortalPage';
import MinoShieldPage from './pages/MinoShieldPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <CartProvider>
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
          <Route path="/custom-plugin" element={<CustomPluginPage />} />
          <Route path="/custom-plugins" element={<CustomPluginPage />} />
          <Route path="/request-success" element={<RequestSuccessPage />} />
          <Route path="/creators" element={<BecomeCreatorPage />} />
          <Route path="/become-creator" element={<BecomeCreatorPage />} />
          <Route path="/upgrade" element={<PricingPage />} />
          <Route path="/membership" element={<PricingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/dashboard" element={<CreatorDashboard />} />
          <Route path="/my-plugins" element={<CreatorDashboard />} />
          <Route path="/upload" element={<UploadPluginPage />} />
          <Route path="/staff/reviews" element={<StaffReviewPage />} />
          <Route path="/users/:username" element={<UserProfilePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/network" element={<NetworkPortalPage />} />
          <Route path="/minoshield" element={<MinoShieldPage />} />
          
          {/* Custom 404 Error Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      
      {/* Global Slide-Over Cart Drawer & Payment Simulator */}
      <CartDrawer />
      <PaymentSimulatorModal />
    </CartProvider>
  );
}

export default App;
