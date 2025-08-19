import React, { useState } from 'react';
import { Users, Calendar, UserPlus, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useData } from '../context/DataContext';

function AdminPanel() {
  const { appointments, doctors, users, addDoctor, removeDoctor } = useData();
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'users'>('appointments');
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = () => {
    switch (activeTab) {
      case 'appointments':
        return appointments.filter(apt =>
          apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          users.find(u => u.id === apt.userId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'doctors':
        return doctors.filter(doc =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'users':
        return users.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600">Manage appointments, doctors, and users</p>
        </div>
        {activeTab === 'doctors' && (
          <button
            onClick={() => setShowAddDoctor(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Appointments" value={appointments.length} />
        <StatCard title="Active Doctors" value={doctors.length} />
        <StatCard title="Registered Users" value={users.length} />
      </div>

      {/* Tabs and Content */}
      <div className="bg-white rounded-xl shadow-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <TabButton
              label="Appointments"
              icon={Calendar}
              active={activeTab === 'appointments'}
              onClick={() => setActiveTab('appointments')}
            />
            <TabButton
              label="Doctors"
              icon={UserPlus}
              active={activeTab === 'doctors'}
              onClick={() => setActiveTab('doctors')}
            />
            <TabButton
              label="Users"
              icon={Users}
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            />
          </nav>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'appointments' && (
            <AppointmentsTable appointments={filteredData()} users={users} />
          )}
          {activeTab === 'doctors' && (
            <DoctorsTable doctors={filteredData()} onRemove={removeDoctor} />
          )}
          {activeTab === 'users' && (
            <UsersTable users={filteredData()} />
          )}
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <AddDoctorModal 
          onClose={() => setShowAddDoctor(false)}
          onAdd={addDoctor}
        />
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function TabButton({ label, icon: Icon, active, onClick }: {
  label: string;
  icon: any;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

function AppointmentsTable({ appointments, users }: {
  appointments: any[];
  users: any[];
}) {
  if (appointments.length === 0) {
    return <div className="text-center py-8 text-gray-500">No appointments found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-3 text-sm font-medium text-gray-600">Patient</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Doctor</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Date</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Time</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => {
            const patient = users.find(u => u.id === appointment.userId);
            return (
              <tr key={appointment.id} className="border-b border-gray-100">
                <td className="py-3">
                  <div>
                    <div className="font-medium">{patient?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{patient?.email}</div>
                  </div>
                </td>
                <td className="py-3">
                  <div>
                    <div className="font-medium">Dr. {appointment.doctorName}</div>
                    <div className="text-sm text-gray-500">{appointment.doctorSpecialization}</div>
                  </div>
                </td>
                <td className="py-3">{new Date(appointment.date).toLocaleDateString()}</td>
                <td className="py-3">{appointment.time}</td>
                <td className="py-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DoctorsTable({ doctors, onRemove }: {
  doctors: any[];
  onRemove: (id: string) => void;
}) {
  if (doctors.length === 0) {
    return <div className="text-center py-8 text-gray-500">No doctors found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-3 text-sm font-medium text-gray-600">Name</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Specialization</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Location</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Rating</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor.id} className="border-b border-gray-100">
              <td className="py-3 font-medium">Dr. {doctor.name}</td>
              <td className="py-3">{doctor.specialization}</td>
              <td className="py-3">{doctor.location}</td>
              <td className="py-3">{doctor.rating} ⭐</td>
              <td className="py-3">
                <button
                  onClick={() => onRemove(doctor.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTable({ users }: { users: any[] }) {
  if (users.length === 0) {
    return <div className="text-center py-8 text-gray-500">No users found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-3 text-sm font-medium text-gray-600">Name</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Email</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Phone</th>
            <th className="pb-3 text-sm font-medium text-gray-600">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-gray-100">
              <td className="py-3 font-medium">{user.name}</td>
              <td className="py-3">{user.email}</td>
              <td className="py-3">{user.phone}</td>
              <td className="py-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddDoctorModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (doctor: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    location: '',
    rating: '4.5',
    reviews: '0',
    experience: '',
    availableTimes: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Date.now().toString(),
      rating: parseFloat(formData.rating),
      reviews: parseInt(formData.reviews)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 animate-scale-in">
        <h2 className="text-xl font-bold mb-4">Add New Doctor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <select
              value={formData.specialization}
              onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Specialization</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Neurology">Neurology</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <textarea
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;