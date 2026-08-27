import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import IpMultiAccountWarningBanner from '../security/IpMultiAccountWarningBanner';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
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
