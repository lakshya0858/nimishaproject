import React, { useState, useEffect } from 'react';
import { User, Calendar, LogOut, Menu, X } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import DoctorList from './components/DoctorList';
import BookingForm from './components/BookingForm';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor);
    setCurrentView('booking');
  };

  const handleBookingComplete = () => {
    setCurrentView('dashboard');
    setSelectedDoctor(null);
  };

  const renderContent = () => {
    if (!user && currentView !== 'register') {
      return <AuthForm onSuccess={() => setCurrentView('home')} />;
    }

    switch (currentView) {
      case 'register':
        return <AuthForm mode="register" onSuccess={() => setCurrentView('home')} />;
      case 'doctors':
        return <DoctorList onDoctorSelect={handleDoctorSelect} />;
      case 'booking':
        return (
          <BookingForm 
            doctor={selectedDoctor} 
            onComplete={handleBookingComplete}
            onCancel={() => setCurrentView('doctors')}
          />
        );
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <div>Access Denied</div>;
      default:
        return <Home onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="fade-in">
          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Home({ onViewChange }: { onViewChange: (view: string) => void }) {
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 slide-up">
            Your Health, Our Priority
          </h1>
          <p className="text-xl mb-8 opacity-90 slide-up delay-200">
            Book appointments with top doctors in your area. Simple, fast, and secure.
          </p>
          {user ? (
            <div className="space-x-4">
              <button
                onClick={() => onViewChange('doctors')}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
              >
                Find Doctors
              </button>
              <button
                onClick={() => onViewChange('dashboard')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                My Dashboard
              </button>
            </div>
          ) : (
            <button
              onClick={() => onViewChange('register')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose HealthCare+</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience seamless healthcare management with our comprehensive platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="👨‍⚕️"
            title="Expert Doctors"
            description="Access to qualified healthcare professionals across various specializations"
          />
          <FeatureCard 
            icon="📅"
            title="Easy Booking"
            description="Simple and intuitive appointment scheduling system"
          />
          <FeatureCard 
            icon="🔒"
            title="Secure & Private"
            description="Your medical data is protected with industry-standard security"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-16 rounded-3xl">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <StatCard number="50+" label="Expert Doctors" />
          <StatCard number="1000+" label="Happy Patients" />
          <StatCard number="15+" label="Specializations" />
          <StatCard number="24/7" label="Support" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;