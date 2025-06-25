/*
  # Hospital Management System Database Schema

  1. New Tables
    - `profiles` - Extended user profiles with role-specific information
    - `departments` - Hospital departments
    - `medical_staff` - Medical staff details
    - `patients` - Patient information
    - `appointments` - Appointment scheduling
    - `medical_documents` - Patient medical records and documents

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure patient data access

  3. Authentication
    - Uses Supabase Auth for user management
    - Role-based permissions through profiles table
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('patient', 'medical_staff', 'management');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE document_type AS ENUM ('lab_result', 'prescription', 'visit_summary', 'imaging', 'discharge_summary');
CREATE TYPE document_status AS ENUM ('normal', 'abnormal', 'pending', 'critical');

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  head_of_department uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Extended user profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL,
  phone text,
  date_of_birth date,
  address text,
  
  -- Medical staff specific fields
  department_id uuid REFERENCES departments(id),
  specialization text,
  license_number text,
  
  -- Patient specific fields
  patient_id text UNIQUE,
  emergency_contact_name text,
  emergency_contact_phone text,
  
  -- Management specific fields
  employee_id text UNIQUE,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medical staff table (additional details)
CREATE TABLE IF NOT EXISTS medical_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  department_id uuid NOT NULL REFERENCES departments(id),
  position text NOT NULL,
  hire_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients table (additional medical info)
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blood_type text,
  allergies text[],
  chronic_conditions text[],
  insurance_provider text,
  insurance_policy_number text,
  primary_doctor_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES profiles(id),
  doctor_id uuid NOT NULL REFERENCES profiles(id),
  department_id uuid REFERENCES departments(id),
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  duration_minutes integer DEFAULT 30,
  appointment_type text NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  notes text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medical documents table
CREATE TABLE IF NOT EXISTS medical_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES profiles(id),
  doctor_id uuid REFERENCES profiles(id),
  department_id uuid REFERENCES departments(id),
  title text NOT NULL,
  document_type document_type NOT NULL,
  document_date date NOT NULL,
  status document_status DEFAULT 'pending',
  summary text,
  content text NOT NULL,
  key_findings text[],
  recommendations text[],
  file_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for departments
CREATE POLICY "Departments are viewable by all authenticated users"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only management can modify departments"
  ON departments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'management'
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Medical staff can view patient profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    role = 'patient' AND EXISTS (
      SELECT 1 FROM profiles staff_profile
      WHERE staff_profile.id = auth.uid() 
      AND staff_profile.role IN ('medical_staff', 'management')
    )
  );

CREATE POLICY "Management can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'management'
    )
  );

-- RLS Policies for medical_staff
CREATE POLICY "Medical staff can view their own record"
  ON medical_staff FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Management can view all medical staff"
  ON medical_staff FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'management'
    )
  );

-- RLS Policies for patients
CREATE POLICY "Patients can view their own record"
  ON patients FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Medical staff can view patient records"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('medical_staff', 'management')
    )
  );

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid() OR doctor_id = auth.uid());

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Medical staff can manage appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (
    doctor_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('medical_staff', 'management')
    )
  );

-- RLS Policies for medical_documents
CREATE POLICY "Patients can view their own documents"
  ON medical_documents FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Medical staff can view and create patient documents"
  ON medical_documents FOR ALL
  TO authenticated
  USING (
    doctor_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('medical_staff', 'management')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_patient_id ON profiles(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON appointments(patient_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_medical_documents_patient ON medical_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_documents_date ON medical_documents(document_date);

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
  ('Emergency Medicine', 'Emergency and urgent care services'),
  ('Cardiology', 'Heart and cardiovascular care'),
  ('Pediatrics', 'Children and adolescent healthcare'),
  ('Orthopedics', 'Bone, joint, and muscle care'),
  ('Neurology', 'Brain and nervous system care'),
  ('General Medicine', 'Primary care and general health services'),
  ('Laboratory', 'Diagnostic testing and analysis'),
  ('Radiology', 'Medical imaging services'),
  ('Administration', 'Hospital management and operations')
ON CONFLICT (name) DO NOTHING;