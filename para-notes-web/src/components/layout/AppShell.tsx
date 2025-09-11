"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { TopBar } from './TopBar';

export interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();

  // Check if we're on desktop and auto-open sidebar
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        currentPath={pathname}
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="container mx-auto px-responsive py-responsive">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export { AppShell };
