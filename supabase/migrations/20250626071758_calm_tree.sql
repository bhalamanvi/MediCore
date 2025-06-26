/*
  # Insert Sample Data for Hospital Management System

  1. Sample Data Creation
    - Creates departments (Cardiology, Administration, Laboratory)
    - Creates sample profiles for demo users
    - Creates medical staff records
    - Creates patient records with medical history
    - Creates sample medical documents (lab results, prescriptions, visit summaries)
    - Creates sample appointments

  2. Important Notes
    - This migration creates profiles with placeholder UUIDs
    - In production, users must first sign up through Supabase Auth
    - After signup, their auth.uid() will be used to create/update profiles
    - Demo users should be created manually in Supabase Dashboard or through the app

  3. Demo User Setup Required
    - Create these users manually in Supabase Dashboard > Authentication > Users:
      * patient@demo.com (password: demo123)
      * doctor@demo.com (password: demo123) 
      * admin@demo.com (password: demo123)
    - Then update the profiles with their actual auth IDs
*/

-- Create departments first
INSERT INTO departments (name, description) VALUES
  ('Cardiology', 'Heart and cardiovascular system care'),
  ('Administration', 'Hospital management and administration'),
  ('Laboratory', 'Medical testing and diagnostics'),
  ('Emergency', 'Emergency medical services'),
  ('Pediatrics', 'Children''s healthcare'),
  ('Orthopedics', 'Bone and joint care')
ON CONFLICT (name) DO NOTHING;

-- Create sample profiles with placeholder UUIDs
-- Note: These will need to be updated with real auth.uid() values after user signup
DO $$
DECLARE
  patient_id uuid := '11111111-1111-1111-1111-111111111111';
  doctor_id uuid := '22222222-2222-2222-2222-222222222222';
  admin_id uuid := '33333333-3333-3333-3333-333333333333';
  cardiology_dept_id uuid;
  admin_dept_id uuid;
  lab_dept_id uuid;
BEGIN
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
    patient_id,
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
    doctor_id,
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
    admin_id,
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
    doctor_id,
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
    patient_id,
    'O+',
    ARRAY['Penicillin', 'Shellfish'],
    ARRAY['Hypertension', 'Type 2 Diabetes'],
    'Blue Cross Blue Shield',
    'BCBS123456789',
    doctor_id
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
    patient_id,
    doctor_id,
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
    patient_id,
    doctor_id,
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
    patient_id,
    doctor_id,
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
    CURRENT_DATE + INTERVAL '10 days',
    '14:15:00',
    'Annual Check-up',
    'scheduled',
    NULL,
    'General Medicine, Room 101'
  );

  -- Log successful completion
  RAISE NOTICE 'Sample data created successfully with placeholder IDs. Remember to create auth users manually and update profile IDs.';

END $$;

-- Create a function to help update profile IDs after auth users are created
CREATE OR REPLACE FUNCTION update_demo_profile_id(old_id uuid, new_id uuid)
RETURNS void AS $$
BEGIN
  -- Update the profile ID
  UPDATE profiles SET id = new_id WHERE id = old_id;
  
  -- Update related tables
  UPDATE medical_staff SET profile_id = new_id WHERE profile_id = old_id;
  UPDATE patients SET profile_id = new_id WHERE profile_id = old_id;
  UPDATE patients SET primary_doctor_id = new_id WHERE primary_doctor_id = old_id;
  UPDATE medical_documents SET patient_id = new_id WHERE patient_id = old_id;
  UPDATE medical_documents SET doctor_id = new_id WHERE doctor_id = old_id;
  UPDATE appointments SET patient_id = new_id WHERE patient_id = old_id;
  UPDATE appointments SET doctor_id = new_id WHERE doctor_id = old_id;
  
  RAISE NOTICE 'Updated profile ID from % to %', old_id, new_id;
END;
$$ LANGUAGE plpgsql;