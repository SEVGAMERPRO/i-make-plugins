import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const DEFAULT_CONFIG = {
  maintenanceMode: false,
  maintenanceMessage: 'MinoForge is currently undergoing scheduled platform upgrades. We will be back shortly!',
  registrationsEnabled: true,
  creatorSubmissionsEnabled: true,
  autoApproveVerifiedCreators: false,
  platformCommissionFeePercent: 10,
  defaultCurrency: 'USD',
  minoShieldSensitivity: 'STRICT',
  maxUploadSizeMB: 500,
  enableAiConfigGenerator: true,
  aiFreeDailyLimit: 2,
  dispatcherEmail: 'MinoForge Verification System',
  adminNotifyEmail: 'MinoForge Administrative Inbound',
  announcement: {
    enabled: false,
    text: '🚀 Welcome to MinoForge! Explore verified plugins with 0% platform fees for Ultimate creators.',
    type: 'info'
  },
  multiAccountPolicy: {
    enabled: true,
    suspensionGracePeriodDays: 20,
    action: 'WARN_AND_COUNTDOWN'
  }
};

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const { user } = useAuth();
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('nimda_system_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CONFIG, ...parsed, maintenanceMode: false }; // Never default to locked maintenance on load
      }
    } catch {}
    return DEFAULT_CONFIG;
  });

  const [loading, setLoading] = useState(false);

  // Check if current user is an Admin or has Nimda secret session
  const isAdmin = () => {
    try {
      const isNimdaAuth = localStorage.getItem('nimda_admin_auth') === 'true';
      const isUserAdmin = user && (user.role === 'ADMIN' || user.role === 'STAFF');
      return Boolean(isNimdaAuth || isUserAdmin);
    } catch {
      return false;
    }
  };

  // Fetch config from server
  const fetchConfig = async () => {
    try {
      const res = await axios.get('/api/admin/config');
      if (res.data?.config) {
        setConfig(res.data.config);
        localStorage.setItem('nimda_system_config', JSON.stringify(res.data.config));
      }
    } catch {
      // Keep local config
    }
  };

  useEffect(() => {
    fetchConfig();
    const interval = setInterval(fetchConfig, 2500); // 2.5s fast live sync
    return () => clearInterval(interval);
  }, []);

  // Update config
  const updateConfig = async (newConfig) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/admin/config', newConfig);
      if (res.data?.config) {
        setConfig(res.data.config);
        localStorage.setItem('nimda_system_config', JSON.stringify(res.data.config));
      }
      return true;
    } catch {
      setConfig(newConfig);
      localStorage.setItem('nimda_system_config', JSON.stringify(newConfig));
      return true;
    } finally {
      setLoading(false);
    }
  };

  const isMaintenanceActive = Boolean(config.maintenanceMode);
  const isBlockedByMaintenance = isMaintenanceActive && !isAdmin();
  const isAdminBypassActive = isMaintenanceActive && isAdmin();

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateConfig,
        fetchConfig,
        loading,
        isAdmin,
        isMaintenanceActive,
        isBlockedByMaintenance,
        isAdminBypassActive
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
