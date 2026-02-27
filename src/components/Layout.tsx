import React from 'react';
import CustomCursor from './CustomCursor';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-dark-bg overflow-hidden">
      <CustomCursor />
      <div className="fixed inset-0 z-0">{children}</div>
    </div>
  );
};

export default Layout;
