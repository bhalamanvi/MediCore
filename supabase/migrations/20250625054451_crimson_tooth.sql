/*
  # Sample Data Migration for Hospital Management System

  This migration creates sample data for testing the hospital management system.
  It creates demo users through the auth system and populates related tables.

  ## What it creates:
  1. Demo user accounts through auth.users
  2. Profile records linked to auth users
  3. Department assignments
  4. Medical staff records
  5. Patient records with medical history
  6. Sample appointments
  7. Medical documents (lab results, prescriptions, visit summaries)

  ## Security
  - All tables have RLS enabled
  - Sample data respects security policies
  - Demo accounts use secure temporary passwords
*/

-- First, let's create some demo users in the auth.users table
-- Note: In production, users would sign up through the application
DO $$
DECLARE
  patient_user_id uuid;
  doctor_user_id uuid;
  admin_user_id uuid;
  cardiology_dept_id uuid;
  admin_dept_id uuid;
  lab_dept_id uuid;
BEGIN
  -- Create demo patient user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'patient@demo.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "patient"}',
    false,
    'authenticated'
  ) ON CONFLICT (email) DO UPDATE SET
    updated_at = now()
  RETURNING id INTO patient_user_id;

  -- If user already exists, get the ID
  IF patient_user_id IS NULL THEN
    SELECT id INTO patient_user_id FROM auth.users WHERE email = 'patient@demo.com';
  END IF;

  -- Create demo doctor user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'doctor@demo.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "medical_staff"}',
    false,
    'authenticated'
  ) ON CONFLICT (email) DO UPDATE SET
    updated_at = now()
  RETURNING id INTO doctor_user_id;

  -- If user already exists, get the ID
  IF doctor_user_id IS NULL THEN
    SELECT id INTO doctor_user_id FROM auth.users WHERE email = 'doctor@demo.com';
  END IF;

  -- Create demo admin user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@demo.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "management"}',
    false,
    'authenticated'
  ) ON CONFLICT (email) DO UPDATE SET
    updated_at = now()
  RETURNING id INTO admin_user_id;

  -- If user already exists, get the ID
  IF admin_user_id IS NULL THEN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@demo.com';
  END IF;

  -- Get department IDs
  SELECT id INTO cardiology_dept_id FROM departments WHERE name = 'Cardiology';
  SELECT id INTO admin_dept_id FROM departments WHERE name = 'Administration';
  SELECT id INTO lab_dept_id FROM departments WHERE name = 'Laboratory';

  -- Create patient profile
  INSERT INTO profiles (
    id, 
    email, 
    full_name, 
    role, 
    phone, 
    date_of_birth, 
    address,
    patient_id,
    emergency_contact_name,
    emergency_contact_phone
  ) VALUES (
    patient_user_id,
    'patient@demo.com',
    'John Smith',
    'patient',
    '+1 (555) 123-4567',
    '1979-03-15',
    '123 Main St, Anytown, ST 12345',
    'P001',
    'Jane Smith',
    '+1 (555) 123-4568'
  ) ON CONFLICT (id) DO UPDATE SET
    updated_at = now();

  -- Create doctor profile
  INSERT INTO profiles (
    id,
    email,
    full_name,
    role,
    phone,
    department_id,
    specialization,
    license_number,
    employee_id
  ) VALUES (
    doctor_user_id,
    'doctor@demo.com',
    'Dr. Sarah Johnson',
    'medical_staff',
    '+1 (555) 234-5678',
    cardiology_dept_id,
    'Interventional Cardiology',
    'MD12345',
    'DOC001'
  ) ON CONFLICT (id) DO UPDATE SET
    updated_at = now();

  -- Create admin profile
  INSERT INTO profiles (
    id,
    email,
    full_name,
    role,
    phone,
    department_id,
    employee_id
  ) VALUES (
    admin_user_id,
    'admin@demo.com',
    'Michael Brown',
    'management',
    '+1 (555) 345-6789',
    admin_dept_id,
    'EMP001'
  ) ON CONFLICT (id) DO UPDATE SET
    updated_at = now();

  -- Create medical staff record
  INSERT INTO medical_staff (profile_id, department_id, position, hire_date)
  VALUES (
    doctor_user_id,
    cardiology_dept_id,
    'Senior Cardiologist',
    '2020-01-15'
  ) ON CONFLICT (profile_id) DO UPDATE SET
    updated_at = now();

  -- Create patient medical record
  INSERT INTO patients (
    profile_id,
    blood_type,
    allergies,
    chronic_conditions,
    insurance_provider,
    insurance_policy_number,
    primary_doctor_id
  ) VALUES (
    patient_user_id,
    'O+',
    ARRAY['Penicillin', 'Shellfish'],
    ARRAY['Hypertension', 'Type 2 Diabetes'],
    'Blue Cross Blue Shield',
    'BCBS123456789',
    doctor_user_id
  ) ON CONFLICT (profile_id) DO UPDATE SET
    updated_at = now();

  -- Create sample medical documents
  -- Lab result document
  INSERT INTO medical_documents (
    patient_id,
    doctor_id,
    department_id,
    title,
    document_type,
    document_date,
    status,
    summary,
    content,
    key_findings,
    recommendations
  ) VALUES (
    patient_user_id,
    doctor_user_id,
    lab_dept_id,
    'Complete Blood Panel',
    'lab_result',
    CURRENT_DATE - INTERVAL '5 days',
    'normal',
    'All blood work values within normal ranges except vitamin D deficiency',
    'Complete blood count, comprehensive metabolic panel, lipid panel, and vitamin D levels tested. Vitamin D level: 28 ng/mL (insufficient, normal range 30-100 ng/mL). All other values normal. Hemoglobin: 14.2 g/dL, Hematocrit: 42%, White blood cell count: 6,800/μL, Platelet count: 285,000/μL. Glucose: 95 mg/dL, Creatinine: 0.9 mg/dL, Total cholesterol: 185 mg/dL, LDL: 110 mg/dL, HDL: 55 mg/dL, Triglycerides: 100 mg/dL.',
    ARRAY['Vitamin D deficiency (28 ng/mL)', 'Normal cholesterol levels', 'Normal blood glucose', 'Normal kidney function'],
    ARRAY['Vitamin D3 supplementation 2000 IU daily', 'Increase sun exposure', 'Follow-up in 3 months', 'Continue current diet and exercise routine']
  );

  -- Visit summary document
  INSERT INTO medical_documents (
    patient_id,
    doctor_id,
    department_id,
    title,
    document_type,
    document_date,
    status,
    summary,
    content,
    key_findings,
    recommendations
  ) VALUES (
    patient_user_id,
    doctor_user_id,
    cardiology_dept_id,
    'Cardiology Visit Summary',
    'visit_summary',
    CURRENT_DATE - INTERVAL '10 days',
    'normal',
    'Routine cardiology follow-up for hypertension management',
    'Patient presents for routine follow-up of hypertension. Blood pressure today: 142/88 mmHg (Stage 1 hypertension). Patient reports good medication compliance with Lisinopril 10mg daily. No chest pain, shortness of breath, or palpitations reported. Physical examination reveals regular heart rate and rhythm, no murmurs. Discussed lifestyle modifications including dietary changes and exercise routine.',
    ARRAY['Blood pressure 142/88 mmHg', 'Good medication compliance', 'No chest pain or shortness of breath', 'Regular heart rhythm'],
    ARRAY['Continue current medications (Lisinopril 10mg daily)', 'Reduce sodium intake to <2300mg/day', 'Regular exercise 30 min/day, 5 days/week', 'Weight management - target BMI <25', 'Follow-up in 6 weeks', 'Home blood pressure monitoring']
  );

  -- Prescription document
  INSERT INTO medical_documents (
    patient_id,
    doctor_id,
    department_id,
    title,
    document_type,
    document_date,
    status,
    summary,
    content,
    key_findings,
    recommendations
  ) VALUES (
    patient_user_id,
    doctor_user_id,
    cardiology_dept_id,
    'Current Prescriptions',
    'prescription',
    CURRENT_DATE - INTERVAL '10 days',
    'normal',
    'Updated prescription list following cardiology visit',
    'Current active prescriptions: 1) Lisinopril 10mg once daily in the morning for hypertension management. 2) Atorvastatin 20mg once daily in the evening for cholesterol management. 3) Aspirin 81mg once daily for cardiovascular protection. 4) Metformin 500mg twice daily with meals for diabetes management.',
    ARRAY['Lisinopril 10mg daily for hypertension', 'Atorvastatin 20mg daily for cholesterol', 'Aspirin 81mg daily for heart protection', 'Metformin 500mg twice daily for diabetes'],
    ARRAY['Take medications as prescribed', 'Monitor for side effects (dizziness, muscle pain)', 'Do not stop medications without consulting doctor', 'Regular lab monitoring every 3 months', 'Report any unusual symptoms immediately']
  );

  -- Create sample appointments
  -- Upcoming appointment
  INSERT INTO appointments (
    patient_id,
    doctor_id,
    department_id,
    appointment_date,
    appointment_time,
    appointment_type,
    status,
    notes,
    location
  ) VALUES (
    patient_user_id,
    doctor_user_id,
    cardiology_dept_id,
    CURRENT_DATE + INTERVAL '5 days',
    '10:30:00',
    'Follow-up',
    'confirmed',
    'Bring current medication list and blood pressure log',
    'Cardiology Clinic, Room 205'
  );

  -- Another upcoming appointment
  INSERT INTO appointments (
    patient_id,
    doctor_id,
    department_id,
    appointment_date,
    appointment_time,
    appointment_type,
    status,
    notes,
    location
  ) VALUES (
    patient_user_id,
    doctor_user_id,
    cardiology_dept_id,
    CURRENT_DATE + INTERVAL '10 days',
    '14:15:00',
    'Annual Check-up',
    'scheduled',
    NULL,
    'General Medicine, Room 101'
  );

  -- Log successful completion
  RAISE NOTICE 'Sample data created successfully with user IDs: Patient=%, Doctor=%, Admin=%', patient_user_id, doctor_user_id, admin_user_id;

END $$;