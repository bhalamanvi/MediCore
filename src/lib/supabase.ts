import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'patient' | 'medical_staff' | 'management'
          phone: string | null
          date_of_birth: string | null
          address: string | null
          department_id: string | null
          specialization: string | null
          license_number: string | null
          patient_id: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'patient' | 'medical_staff' | 'management'
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          department_id?: string | null
          specialization?: string | null
          license_number?: string | null
          patient_id?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
        }
        Update: {
          email?: string
          full_name?: string
          role?: 'patient' | 'medical_staff' | 'management'
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          department_id?: string | null
          specialization?: string | null
          license_number?: string | null
          patient_id?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          head_of_department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          description?: string | null
          head_of_department?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          head_of_department?: string | null
        }
      }
      medical_documents: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string | null
          department_id: string | null
          title: string
          document_type: 'lab_result' | 'prescription' | 'visit_summary' | 'imaging' | 'discharge_summary'
          document_date: string
          status: 'normal' | 'abnormal' | 'pending' | 'critical'
          summary: string | null
          content: string
          key_findings: string[] | null
          recommendations: string[] | null
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          patient_id: string
          doctor_id?: string | null
          department_id?: string | null
          title: string
          document_type: 'lab_result' | 'prescription' | 'visit_summary' | 'imaging' | 'discharge_summary'
          document_date: string
          status?: 'normal' | 'abnormal' | 'pending' | 'critical'
          summary?: string | null
          content: string
          key_findings?: string[] | null
          recommendations?: string[] | null
          file_url?: string | null
        }
        Update: {
          title?: string
          document_type?: 'lab_result' | 'prescription' | 'visit_summary' | 'imaging' | 'discharge_summary'
          document_date?: string
          status?: 'normal' | 'abnormal' | 'pending' | 'critical'
          summary?: string | null
          content?: string
          key_findings?: string[] | null
          recommendations?: string[] | null
          file_url?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          department_id: string | null
          appointment_date: string
          appointment_time: string
          duration_minutes: number | null
          appointment_type: string
          status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          notes: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          patient_id: string
          doctor_id: string
          department_id?: string | null
          appointment_date: string
          appointment_time: string
          duration_minutes?: number | null
          appointment_type: string
          status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          notes?: string | null
          location?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          duration_minutes?: number | null
          appointment_type?: string
          status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          notes?: string | null
          location?: string | null
        }
      }
    }
  }
}