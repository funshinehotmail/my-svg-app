import React from 'react';
import { useAppStore } from '../../store/appStore';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../../utils/cn';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen } = useAppStore();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main 
          className={cn(
            'flex-1 transition-all duration-300 ease-in-out',
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
          )}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
