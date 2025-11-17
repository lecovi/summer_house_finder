import React from 'react';
import type { View } from '../types';
import { HomeIcon, CogIcon, ClockIcon, BellIcon } from './common/Icons';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  newListingCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, newListingCount }) => {
  
  const getButtonClass = (view: View) => {
    const baseClass = "relative flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300";
    if (currentView === view) {
      return `${baseClass} bg-primary-container text-on-primary-container`;
    }
    return `${baseClass} text-on-surface-variant hover:bg-surface-variant`;
  };
  
  const NavButton: React.FC<{view: View, label: string, icon: React.ReactNode}> = ({view, label, icon}) => (
    <button
      onClick={() => setView(view)}
      className={getButtonClass(view)}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-medium text-on-surface">Finder de Quintas</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <NavButton view="dashboard" label="Dashboard" icon={<HomeIcon />} />
            <NavButton view="activity" label="Actividad" icon={<ClockIcon />} />
            
            <button className="relative text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-white/10 transition-colors">
              <BellIcon />
              {newListingCount > 0 && (
                <span className="absolute top-0.5 right-0.5 block h-5 w-5 rounded-full ring-2 ring-surface bg-error text-on-error text-xs flex items-center justify-center">
                  {newListingCount}
                </span>
              )}
            </button>

            <NavButton view="settings" label="Configuración" icon={<CogIcon />} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
