import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Calendar, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';

interface DoctorListProps {
  onDoctorSelect: (doctor: any) => void;
}

function DoctorList({ onDoctorSelect }: DoctorListProps) {
  const { doctors } = useData();
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const specializations = [...new Set(doctors.map(doc => doc.specialization))];
  const locations = [...new Set(doctors.map(doc => doc.location))];

  useEffect(() => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialization);
    }

    if (selectedLocation) {
      filtered = filtered.filter(doctor => doctor.location === selectedLocation);
    }

    // Sort by rating
    filtered.sort((a, b) => b.rating - a.rating);

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, selectedSpecialization, selectedLocation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Your Doctor</h1>
        <p className="text-gray-600">Choose from our network of experienced healthcare professionals</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors or specializations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <div className="text-sm text-gray-500">
              {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg animate-slide-down">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <DoctorCard 
            key={doctor.id} 
            doctor={doctor} 
            onSelect={() => onDoctorSelect(doctor)} 
          />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No doctors found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}

function DoctorCard({ doctor, onSelect }: { doctor: any; onSelect: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {doctor.name.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Dr. {doctor.name}</h3>
            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{doctor.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{doctor.rating}</span>
            <span className="text-sm text-gray-500">({doctor.reviews} reviews)</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{doctor.experience}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Available Times:</p>
          <div className="flex flex-wrap gap-1">
            {doctor.availableTimes.slice(0, 3).map((time: string, index: number) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {time}
              </span>
            ))}
            {doctor.availableTimes.length > 3 && (
              <span className="text-xs text-gray-500">+{doctor.availableTimes.length - 3} more</span>
            )}
          </div>
        </div>

        <button
          onClick={onSelect}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>
    </div>
  );
}

export default DoctorList;