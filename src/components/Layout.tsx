import React from 'react';
import { Settings as SettingsIcon, Calendar } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showSettings: boolean;
  onToggleSettings: () => void;
}

export function Layout({ children, showSettings, onToggleSettings }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <img 
              src="/mealymatch/img/mealymatchLogo.png" 
              alt="mealy.match" 
              className="h-[35px] w-auto"
            />
            <nav className="flex space-x-4">
              <button
                onClick={onToggleSettings}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  showSettings
                    ? 'bg-violet-600 text-gray-100'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {showSettings ? (
                  <>
                    <Calendar className="icon-lg" />
                    Planning
                  </>
                ) : (
                  <>
                    <SettingsIcon className="icon-lg" />
                    Gestion
                  </>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}