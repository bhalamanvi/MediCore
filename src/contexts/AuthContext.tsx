import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '../types/auth';
import { supabase } from '../lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
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
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile from database
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.full_name,
            role: profile.role,
            department: profile.specialization || profile.department_id,
            specialization: profile.specialization,
            licenseNumber: profile.license_number,
            patientId: profile.patient_id
          };

          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
          return;
        }
      }

      // Fallback to localStorage for demo users
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
    } catch (error) {
      console.error('Session check error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      // Try Supabase authentication first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Fallback to mock authentication for demo users
        const user = mockUsers[email];
        
        if (!user || user.role !== role || password !== 'demo123') {
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
        return;
      }

      // Get user profile from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!profile || profile.role !== role) {
        await supabase.auth.signOut();
        throw new Error('Invalid role or profile not found');
      }

      const user: User = {
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        role: profile.role,
        department: profile.specialization || profile.department_id,
        specialization: profile.specialization,
        licenseNumber: profile.license_number,
        patientId: profile.patient_id
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Failed to create user account');
      }

      // Create profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role,
          patient_id: role === 'patient' ? `P${Date.now().toString().slice(-6)}` : null,
          employee_id: role !== 'patient' ? `EMP${Date.now().toString().slice(-6)}` : null
        });

      if (profileError) {
        // Clean up auth user if profile creation fails
        await supabase.auth.signOut();
        throw new Error('Failed to create user profile');
      }

      // Create role-specific records
      if (role === 'patient') {
        await supabase
          .from('patients')
          .insert({
            profile_id: data.user.id
          });
      } else if (role === 'medical_staff') {
        // Get a default department (Cardiology)
        const { data: dept } = await supabase
          .from('departments')
          .select('id')
          .eq('name', 'Cardiology')
          .single();

        if (dept) {
          await supabase
            .from('medical_staff')
            .insert({
              profile_id: data.user.id,
              department_id: dept.id,
              position: 'Staff Member'
            });
        }
      }

      // Auto-login after successful signup
      const user: User = {
        id: data.user.id,
        email: email,
        name: fullName,
        role: role,
        patientId: role === 'patient' ? `P${Date.now().toString().slice(-6)}` : undefined
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });

    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
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
      signUp,
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