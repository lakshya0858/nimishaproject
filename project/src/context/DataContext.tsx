import React, { createContext, useContext, useState, useEffect } from 'react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: string;
  rating: number;
  reviews: number;
  experience: string;
  availableTimes: string[];
}

interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  description: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

interface DataContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  users: any[];
  addAppointment: (appointment: Appointment) => void;
  cancelAppointment: (appointmentId: string) => void;
  addDoctor: (doctor: Doctor) => void;
  removeDoctor: (doctorId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const SAMPLE_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    specialization: 'Cardiology',
    location: 'Downtown Medical Center',
    rating: 4.9,
    reviews: 127,
    experience: '15+ years of experience in cardiovascular medicine. Specialized in heart disease prevention and treatment.',
    availableTimes: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  {
    id: '2',
    name: 'Michael Chen',
    specialization: 'Dermatology',
    location: 'Westside Clinic',
    rating: 4.8,
    reviews: 95,
    experience: '12+ years treating skin conditions, acne, and cosmetic dermatology procedures.',
    availableTimes: ['08:00 AM', '09:00 AM', '01:00 PM', '02:00 PM', '03:00 PM']
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    specialization: 'Pediatrics',
    location: "Children's Health Center",
    rating: 4.9,
    reviews: 203,
    experience: '18+ years caring for infants, children, and adolescents. Board-certified pediatrician.',
    availableTimes: ['08:30 AM', '09:30 AM', '10:30 AM', '02:30 PM', '03:30 PM', '04:30 PM']
  },
  {
    id: '4',
    name: 'David Wilson',
    specialization: 'Orthopedics',
    location: 'Sports Medicine Institute',
    rating: 4.7,
    reviews: 156,
    experience: '20+ years in orthopedic surgery and sports medicine. Specialized in joint replacement.',
    availableTimes: ['07:00 AM', '08:00 AM', '01:00 PM', '02:00 PM']
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    specialization: 'Neurology',
    location: 'Brain & Spine Center',
    rating: 4.8,
    reviews: 89,
    experience: '14+ years treating neurological disorders, epilepsy, and movement disorders.',
    availableTimes: ['09:00 AM', '10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM']
  },
  {
    id: '6',
    name: 'Robert Martinez',
    specialization: 'Internal Medicine',
    location: 'Family Health Clinic',
    rating: 4.6,
    reviews: 178,
    experience: '16+ years in primary care and preventive medicine for adults.',
    availableTimes: ['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Load data from localStorage or use sample data
    const savedDoctors = localStorage.getItem('doctors');
    const savedAppointments = localStorage.getItem('appointments');
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    setDoctors(savedDoctors ? JSON.parse(savedDoctors) : SAMPLE_DOCTORS);
    setAppointments(savedAppointments ? JSON.parse(savedAppointments) : []);
    setUsers([
      { id: '1', name: 'Admin User', email: 'admin@demo.com', phone: '+1 (555) 123-4567', role: 'admin' },
      { id: '2', name: 'John Doe', email: 'user@demo.com', phone: '+1 (555) 987-6543', role: 'user' },
      ...registeredUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role
      }))
    ]);
  }, []);

  const addAppointment = (appointment: Appointment) => {
    const updatedAppointments = [...appointments, appointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const cancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const addDoctor = (doctor: Doctor) => {
    const updatedDoctors = [...doctors, doctor];
    setDoctors(updatedDoctors);
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
  };

  const removeDoctor = (doctorId: string) => {
    const updatedDoctors = doctors.filter(doc => doc.id !== doctorId);
    setDoctors(updatedDoctors);
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
  };

  return (
    <DataContext.Provider value={{
      doctors,
      appointments,
      users,
      addAppointment,
      cancelAppointment,
      addDoctor,
      removeDoctor
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}