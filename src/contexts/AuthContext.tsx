import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in production, this would come from Supabase
const mockUsers: Record<string, User> = {
  'patient@demo.com': {
    id: '1',
    email: 'patient@demo.com',
    name: 'John Smith',
    role: 'patient',
    patientId: 'P001'
  },
  'doctor@demo.com': {
    id: '2',
    email: 'doctor@demo.com',
    name: 'Dr. Sarah Johnson',
    role: 'medical_staff',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    licenseNumber: 'MD12345'
  },
  'admin@demo.com': {
    id: '3',
    email: 'admin@demo.com',
    name: 'Michael Brown',
    role: 'management',
    department: 'Administration'
  }
};

// Role-based permissions
const rolePermissions: Record<UserRole, string[]> = {
  patient: [
    'view_own_appointments',
    'view_own_medical_records',
    'view_own_billing',
    'schedule_appointments',
    'update_own_profile'
  ],
  medical_staff: [
    'view_patient_records',
    'update_patient_records',
    'view_appointments',
    'manage_appointments',
    'view_medical_inventory',
    'view_room_status',
    'create_prescriptions'
  ],
  management: [
    'view_all_data',
    'manage_staff',
    'view_analytics',
    'manage_billing',
    'manage_inventory',
    'manage_rooms',
    'view_reports',
    'system_settings'
  ]
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('hospital_user');
    if (savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    // Mock authentication - in production, use Supabase Auth
    const user = mockUsers[email];
    
    if (!user || user.role !== role) {
      throw new Error('Invalid credentials or role mismatch');
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    localStorage.setItem('hospital_user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('hospital_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    return rolePermissions[authState.user.role].includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}