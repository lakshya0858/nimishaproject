import React, { useState } from 'react';
import { Calendar, Clock, User, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

function Dashboard() {
  const { user } = useAuth();
  const { appointments, doctors, cancelAppointment } = useData();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showProfile, setShowProfile] = useState(false);

  const userAppointments = appointments.filter(apt => apt.userId === user?.id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = userAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate >= today && apt.status !== 'cancelled';
  });

  const pastAppointments = userAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate < today || apt.status === 'cancelled';
  });

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment(appointmentId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Manage your appointments and profile</p>
        </div>
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>

      {/* Profile Section */}
      {showProfile && (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-down">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{user?.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-gray-900 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Total Appointments"
          value={userAppointments.length}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Upcoming"
          value={upcomingAppointments.length}
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Completed"
          value={pastAppointments.filter(apt => apt.status !== 'cancelled').length}
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Appointments Section */}
      <div className="bg-white rounded-xl shadow-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <TabButton
              label="Upcoming Appointments"
              active={activeTab === 'upcoming'}
              count={upcomingAppointments.length}
              onClick={() => setActiveTab('upcoming')}
            />
            <TabButton
              label="Past Appointments"
              active={activeTab === 'past'}
              count={pastAppointments.length}
              onClick={() => setActiveTab('past')}
            />
          </nav>
        </div>

        {/* Appointment List */}
        <div className="p-6">
          {activeTab === 'upcoming' ? (
            <AppointmentList
              appointments={upcomingAppointments}
              doctors={doctors}
              onCancel={handleCancelAppointment}
              showActions={true}
            />
          ) : (
            <AppointmentList
              appointments={pastAppointments}
              doctors={doctors}
              showActions={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, count, onClick }: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label} ({count})
    </button>
  );
}

function AppointmentList({ appointments, doctors, onCancel, showActions }: {
  appointments: any[];
  doctors: any[];
  onCancel?: (id: string) => void;
  showActions: boolean;
}) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No appointments found</h3>
        <p className="text-gray-500">Your appointments will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map(appointment => {
        const doctor = doctors.find(d => d.id === appointment.doctorId);
        return (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            doctor={doctor}
            onCancel={onCancel}
            showActions={showActions}
          />
        );
      })}
    </div>
  );
}

function AppointmentCard({ appointment, doctor, onCancel, showActions }: {
  appointment: any;
  doctor?: any;
  onCancel?: (id: string) => void;
  showActions: boolean;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {doctor ? doctor.name.split(' ').map((n: string) => n[0]).join('') : 'Dr'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Dr. {appointment.doctorName}
              </h3>
              <p className="text-sm text-blue-600">{appointment.doctorSpecialization}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{appointment.time}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3">{appointment.description}</p>

          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>

        {showActions && appointment.status === 'confirmed' && onCancel && (
          <button
            onClick={() => onCancel(appointment.id)}
            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;