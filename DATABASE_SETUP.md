# Database Setup Guide for MediCore HMS

## Prerequisites

Before setting up the database, you need to:

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your Supabase Credentials**
   - Project URL
   - Anon/Public Key
   - Service Role Key (for admin operations)

## Step 1: Environment Setup

Create a `.env` file in your project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: Database Schema Setup

1. **Go to your Supabase Dashboard**
   - Navigate to the SQL Editor
   - Create a new query

2. **Run the Schema Migration**
   - Copy the contents of `supabase/migrations/create_hospital_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Insert Sample Data**
   - Copy the contents of `supabase/migrations/insert_sample_data.sql`
   - Paste it into a new query
   - Click "Run" to execute

## Step 3: Authentication Setup

1. **Configure Authentication**
   - Go to Authentication → Settings in your Supabase dashboard
   - Disable email confirmation for demo purposes
   - Enable email/password authentication

2. **Create Demo Users**
   - Go to Authentication → Users
   - Add these demo users manually:

   **Patient User:**
   - Email: `patient@demo.com`
   - Password: `demo123`
   - User ID: `11111111-1111-1111-1111-111111111111`

   **Medical Staff User:**
   - Email: `doctor@demo.com`
   - Password: `demo123`
   - User ID: `22222222-2222-2222-2222-222222222222`

   **Management User:**
   - Email: `admin@demo.com`
   - Password: `demo123`
   - User ID: `33333333-3333-3333-3333-333333333333`

## Step 4: Row Level Security (RLS)

The schema automatically sets up RLS policies for:

- **Patients**: Can only view their own data
- **Medical Staff**: Can view patient data and manage appointments
- **Management**: Can view all data and manage users

## Step 5: Adding New Users

### Through the Application (Recommended)

1. **User Registration**
   - Users sign up through the login form
   - They select their role during registration
   - A profile is automatically created

2. **Admin Assignment**
   - Management users can assign departments
   - Medical staff can be linked to specializations
   - Patient records can be enhanced with medical info

### Through Supabase Dashboard (Admin)

1. **Create User in Auth**
   - Go to Authentication → Users
   - Click "Add User"
   - Enter email and password

2. **Create Profile**
   - Go to Table Editor → profiles
   - Insert new row with user's auth ID
   - Set role, name, and other details

3. **Add Role-Specific Data**
   - For medical staff: Add to `medical_staff` table
   - For patients: Add to `patients` table
   - Link to appropriate departments

## Database Tables Overview

### Core Tables

- **profiles**: Extended user information with role-based fields
- **departments**: Hospital departments and specializations
- **medical_staff**: Additional details for medical personnel
- **patients**: Patient-specific medical information
- **appointments**: Appointment scheduling and management
- **medical_documents**: Patient medical records and documents

### Key Features

- **Role-Based Access**: Automatic data filtering based on user role
- **Audit Trail**: Created/updated timestamps on all records
- **Data Integrity**: Foreign key constraints and validation
- **Performance**: Optimized indexes for common queries

## Security Features

- **Row Level Security**: Data access based on user authentication
- **Role-Based Permissions**: Different access levels for each user type
- **Data Encryption**: Supabase handles encryption at rest and in transit
- **Audit Logging**: Track all data access and modifications

## Troubleshooting

### Common Issues

1. **RLS Policies Not Working**
   - Ensure user is authenticated
   - Check if profile exists for the user
   - Verify role assignment

2. **Foreign Key Errors**
   - Ensure referenced records exist
   - Check UUID format consistency

3. **Permission Denied**
   - Verify RLS policies are correctly set
   - Check user role in profiles table

### Testing the Setup

1. **Login with Demo Accounts**
   - Test each role (patient, medical_staff, management)
   - Verify appropriate data visibility

2. **Create Test Records**
   - Add appointments, medical documents
   - Test data access restrictions

3. **User Management**
   - Test adding new users through the management interface
   - Verify role assignments work correctly

## Production Considerations

1. **Environment Variables**
   - Use different Supabase projects for dev/staging/production
   - Secure your service role key

2. **Data Backup**
   - Set up automated backups in Supabase
   - Test restore procedures

3. **Monitoring**
   - Set up alerts for database performance
   - Monitor RLS policy effectiveness

4. **Compliance**
   - Ensure HIPAA compliance for medical data
   - Implement proper audit logging
   - Regular security reviews

## Next Steps

After setting up the database:

1. **Connect the Application**
   - Update your `.env` file with Supabase credentials
   - Test the connection with demo users

2. **Customize for Your Needs**
   - Add additional fields to tables
   - Create custom RLS policies
   - Add more departments and specializations

3. **Deploy to Production**
   - Set up production Supabase project
   - Configure proper backup and monitoring
   - Implement additional security measures