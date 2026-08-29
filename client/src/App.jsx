import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/layout/Layout';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ConfigProvider } from './context/ConfigContext';
import { LanguageProvider } from './context/LanguageContext';
import CartDrawer from './components/cart/CartDrawer';
import PaymentSimulatorModal from './components/cart/PaymentSimulatorModal';

function PageViewTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (location.pathname !== '/nimda') {
      axios.post('/api/admin/track-view', {
        path: location.pathname,
        user: user ? { username: user.username, email: user.email } : null
      }).catch(() => {});
    }
  }, [location.pathname, user]);

  return null;
}

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
import CheckoutPage from './pages/CheckoutPage';
import UltimateSuccessPage from './pages/UltimateSuccessPage';
import YourUltimatePage from './pages/YourUltimatePage';
import AdsManagerPage from './pages/AdsManagerPage';
import CustomPluginPage from './pages/CustomPluginPage';
import RequestSuccessPage from './pages/RequestSuccessPage';
import BecomeCreatorPage from './pages/BecomeCreatorPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NetworkPortalPage from './pages/NetworkPortalPage';
import MinoShieldPage from './pages/MinoShieldPage';
import NotFoundPage from './pages/NotFoundPage';
import NimdaStaffLoginPage from './pages/NimdaStaffLoginPage';
import StaffTicketsPage from './pages/StaffTicketsPage';
import DiscordConnectPage from './pages/DiscordConnectPage';
import SettingsPage from './pages/SettingsPage';
import CrashAnalyzerPage from './pages/CrashAnalyzerPage';

function App() {
  return (
    <ConfigProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <CartProvider>
            <Layout>
            <PageViewTracker />
            <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/2fa" element={<SettingsPage />} />
          <Route path="/security" element={<SettingsPage />} />
          <Route path="/2fa" element={<SettingsPage />} />
          <Route path="/discord" element={<DiscordConnectPage />} />
          <Route path="/discord-connect" element={<DiscordConnectPage />} />
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
          <Route path="/ultimate" element={<YourUltimatePage />} />
          <Route path="/your-ultimate" element={<YourUltimatePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/ultimate" element={<CheckoutPage />} />
          <Route path="/receipt" element={<UltimateSuccessPage />} />
          <Route path="/receipt/:checkoutId" element={<UltimateSuccessPage />} />
          <Route path="/checkout/success" element={<UltimateSuccessPage />} />
          <Route path="/checkout/success/:checkoutId" element={<UltimateSuccessPage />} />
          <Route path="/order-success/:checkoutId" element={<UltimateSuccessPage />} />
          <Route path="/ultimate/success" element={<UltimateSuccessPage />} />
          <Route path="/order-success" element={<UltimateSuccessPage />} />
          <Route path="/success" element={<UltimateSuccessPage />} />
          <Route path="/analyzer" element={<CrashAnalyzerPage />} />
          <Route path="/crash-analyzer" element={<CrashAnalyzerPage />} />
          <Route path="/dashboard" element={<CreatorDashboard />} />
          <Route path="/my-plugins" element={<CreatorDashboard />} />
          <Route path="/upload" element={<UploadPluginPage />} />
          <Route path="/staff/reviews" element={<StaffReviewPage />} />
          <Route path="/staff/tickets" element={<StaffTicketsPage />} />
          <Route path="/support-tickets" element={<StaffTicketsPage />} />
          <Route path="/support" element={<StaffTicketsPage />} />
          <Route path="/users/:username" element={<UserProfilePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/network" element={<NetworkPortalPage />} />
          <Route path="/minoshield" element={<MinoShieldPage />} />
          
          {/* Top-Secret Staff Gateway (Do not mention in public menus) */}
          <Route path="/nimda" element={<NimdaStaffLoginPage />} />
          
          {/* Custom 404 Error Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      
        {/* Global Slide-Over Cart Drawer & Payment Simulator */}
        <CartDrawer />
        <PaymentSimulatorModal />
        </CartProvider>
      </CurrencyProvider>
      </LanguageProvider>
    </ConfigProvider>
  );
}

export default App;
