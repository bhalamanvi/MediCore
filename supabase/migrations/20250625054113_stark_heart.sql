/*
  # Insert Sample Data for Hospital Management System

  1. Sample Users and Profiles
    - Demo patients, medical staff, and management users
    - Realistic medical data for testing

  2. Sample Medical Records
    - Lab results, prescriptions, visit summaries
    - Linked to demo patients

  3. Sample Appointments
    - Upcoming and past appointments
    - Various appointment types and statuses
*/

-- Note: This migration assumes the demo users have been created through Supabase Auth
-- In production, you would create these users through the authentication system

-- Sample profiles (these would be created when users sign up)
-- The UUIDs here are examples - in production, these would be the actual auth.users IDs

-- Insert sample patient profile
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
  '11111111-1111-1111-1111-111111111111',
  'patient@demo.com',
  'John Smith',
  'patient',
  '+1 (555) 123-4567',
  '1979-03-15',
  '123 Main St, Anytown, ST 12345',
  'P001',
  'Jane Smith',
  '+1 (555) 123-4568'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample medical staff profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  phone,
  specialization,
  license_number
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'doctor@demo.com',
  'Dr. Sarah Johnson',
  'medical_staff',
  '+1 (555) 234-5678',
  'Interventional Cardiology',
  'MD12345'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample management profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  phone,
  employee_id
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'admin@demo.com',
  'Michael Brown',
  'management',
  '+1 (555) 345-6789',
  'EMP001'
) ON CONFLICT (id) DO NOTHING;

-- Link medical staff to department
DO $$
DECLARE
  cardiology_dept_id uuid;
  admin_dept_id uuid;
BEGIN
  -- Get department IDs
  SELECT id INTO cardiology_dept_id FROM departments WHERE name = 'Cardiology';
  SELECT id INTO admin_dept_id FROM departments WHERE name = 'Administration';
  
  -- Update profiles with department IDs
  UPDATE profiles 
  SET department_id = cardiology_dept_id 
  WHERE email = 'doctor@demo.com';
  
  UPDATE profiles 
  SET department_id = admin_dept_id 
  WHERE email = 'admin@demo.com';
  
  -- Insert medical staff record
  INSERT INTO medical_staff (profile_id, department_id, position, hire_date)
  VALUES (
    '22222222-2222-2222-2222-222222222222',
    cardiology_dept_id,
    'Senior Cardiologist',
    '2020-01-15'
  ) ON CONFLICT DO NOTHING;
END $$;

-- Insert patient medical info
INSERT INTO patients (
  profile_id,
  blood_type,
  allergies,
  chronic_conditions,
  insurance_provider,
  insurance_policy_number,
  primary_doctor_id
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'O+',
  ARRAY['Penicillin', 'Shellfish'],
  ARRAY['Hypertension', 'Type 2 Diabetes'],
  'Blue Cross Blue Shield',
  'BCBS123456789',
  '22222222-2222-2222-2222-222222222222'
) ON CONFLICT (profile_id) DO NOTHING;

-- Insert sample medical documents
DO $$
DECLARE
  patient_id uuid := '11111111-1111-1111-1111-111111111111';
  doctor_id uuid := '22222222-2222-2222-2222-222222222222';
  cardiology_dept_id uuid;
  lab_dept_id uuid;
BEGIN
  SELECT id INTO cardiology_dept_id FROM departments WHERE name = 'Cardiology';
  SELECT id INTO lab_dept_id FROM departments WHERE name = 'Laboratory';

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
    patient_id,
    doctor_id,
    lab_dept_id,
    'Complete Blood Panel',
    'lab_result',
    '2024-01-15',
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
    patient_id,
    doctor_id,
    cardiology_dept_id,
    'Cardiology Visit Summary',
    'visit_summary',
    '2024-01-10',
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
    patient_id,
    doctor_id,
    cardiology_dept_id,
    'Current Prescriptions',
    'prescription',
    '2024-01-10',
    'normal',
    'Updated prescription list following cardiology visit',
    'Current active prescriptions: 1) Lisinopril 10mg once daily in the morning for hypertension management. 2) Atorvastatin 20mg once daily in the evening for cholesterol management. 3) Aspirin 81mg once daily for cardiovascular protection. 4) Metformin 500mg twice daily with meals for diabetes management.',
    ARRAY['Lisinopril 10mg daily for hypertension', 'Atorvastatin 20mg daily for cholesterol', 'Aspirin 81mg daily for heart protection', 'Metformin 500mg twice daily for diabetes'],
    ARRAY['Take medications as prescribed', 'Monitor for side effects (dizziness, muscle pain)', 'Do not stop medications without consulting doctor', 'Regular lab monitoring every 3 months', 'Report any unusual symptoms immediately']
  );
END $$;

-- Insert sample appointments
DO $$
DECLARE
  patient_id uuid := '11111111-1111-1111-1111-111111111111';
  doctor_id uuid := '22222222-2222-2222-2222-222222222222';
  cardiology_dept_id uuid;
BEGIN
  SELECT id INTO cardiology_dept_id FROM departments WHERE name = 'Cardiology';

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
    patient_id,
    doctor_id,
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
    cardiology_dept_id,
    CURRENT_DATE + INTERVAL '10 days',
    '14:15:00',
    'Annual Check-up',
    'scheduled',
    NULL,
    'General Medicine, Room 101'
  ) VALUES (
    patient_id,
    doctor_id,
    cardiology_dept_id,
    CURRENT_DATE + INTERVAL '10 days',
    '14:15:00',
    'Annual Check-up',
    'scheduled',
    NULL,
    'General Medicine, Room 101'
  );
END $$;