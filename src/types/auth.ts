export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  specialization?: string;
  licenseNumber?: string;
  patientId?: string;
}

export type UserRole = 'patient' | 'medical_staff' | 'management';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}