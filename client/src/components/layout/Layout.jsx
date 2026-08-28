import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import IpMultiAccountWarningBanner from '../security/IpMultiAccountWarningBanner';
import { 
  GlobalAnnouncementBanner, 
  AdminMaintenanceBypassBar, 
  MaintenanceScreen 
} from '../security/MaintenanceModeOverlay';
import { useConfig } from '../../context/ConfigContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isBlockedByMaintenance } = useConfig();

  // Always treat secret admin gateway (/nimda) as an isolated, standalone portal
  const isNimdaRoute = location.pathname === '/nimda';

  // If on /nimda, render pure standalone layout with zero public website headers/footers
  if (isNimdaRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070a12]">
        {children}
      </div>
    );
  }

  // If maintenance mode is active and user is not an admin, show Maintenance Screen
  if (isBlockedByMaintenance) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Top Broadcast Announcement */}
      <GlobalAnnouncementBanner />

      {/* Admin Maintenance Bypass Notice */}
      <AdminMaintenanceBypassBar />

      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-grow pt-16 flex flex-col">
        <IpMultiAccountWarningBanner />
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
