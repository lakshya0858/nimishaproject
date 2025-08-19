import React from 'react';
import { User, Calendar, LogOut, Menu, X, Shield, Home, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function Header({ currentView, onViewChange, mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">HealthCare+</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavButton 
                label="Home" 
                icon={Home}
                active={currentView === 'home'}
                onClick={() => onViewChange('home')} 
              />
              
              {user && (
                <>
                  <NavButton 
                    label="Find Doctors" 
                    icon={Users}
                    active={currentView === 'doctors'}
                    onClick={() => onViewChange('doctors')} 
                  />
                  <NavButton 
                    label="Dashboard" 
                    icon={Calendar}
                    active={currentView === 'dashboard'}
                    onClick={() => onViewChange('dashboard')} 
                  />
                  {user.role === 'admin' && (
                    <NavButton 
                      label="Admin" 
                      icon={Shield}
                      active={currentView === 'admin'}
                      onClick={() => onViewChange('admin')} 
                    />
                  )}
                </>
              )}
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <div className="font-medium">Welcome, {user.name}</div>
                    <div className="text-gray-500">{user.role}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onViewChange('register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-16 left-0 right-0 bg-white shadow-lg z-40 md:hidden transform transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <nav className="px-4 py-6 space-y-4">
          <MobileNavButton 
            label="Home" 
            icon={Home}
            active={currentView === 'home'}
            onClick={() => {
              onViewChange('home');
              setMobileMenuOpen(false);
            }} 
          />
          
          {user && (
            <>
              <MobileNavButton 
                label="Find Doctors" 
                icon={Users}
                active={currentView === 'doctors'}
                onClick={() => {
                  onViewChange('doctors');
                  setMobileMenuOpen(false);
                }} 
              />
              <MobileNavButton 
                label="Dashboard" 
                icon={Calendar}
                active={currentView === 'dashboard'}
                onClick={() => {
                  onViewChange('dashboard');
                  setMobileMenuOpen(false);
                }} 
              />
              {user.role === 'admin' && (
                <MobileNavButton 
                  label="Admin" 
                  icon={Shield}
                  active={currentView === 'admin'}
                  onClick={() => {
                    onViewChange('admin');
                    setMobileMenuOpen(false);
                  }} 
                />
              )}
            </>
          )}

          <div className="border-t pt-4 mt-4">
            {user ? (
              <div className="space-y-4">
                <div className="text-sm">
                  <div className="font-medium">Welcome, {user.name}</div>
                  <div className="text-gray-500">{user.role}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onViewChange('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Sign Up
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

function NavButton({ label, icon: Icon, active, onClick }: {
  label: string;
  icon: any;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

function MobileNavButton({ label, icon: Icon, active, onClick }: {
  label: string;
  icon: any;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

export default Header;