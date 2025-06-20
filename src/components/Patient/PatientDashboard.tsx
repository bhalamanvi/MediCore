import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, FileText, CreditCard, Clock, User, Phone, Mail, MapPin, MessageSquare, Activity, Heart, Pill } from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import AIAssistant from './AIAssistant';
import { MedicalDocument, Appointment } from '../../types/medical';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-assistant'>('overview');

  // Mock patient data - in production, this would come from Supabase
  const [patientDocuments] = useState<MedicalDocument[]>([
    {
      id: '1',
      title: 'Complete Blood Panel',
      type: 'lab_result',
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      department: 'Laboratory',
      status: 'normal',
      summary: 'All blood work values within normal ranges except vitamin D deficiency',
      content: 'Complete blood count, comprehensive metabolic panel, lipid panel, and vitamin D levels tested. Vitamin D level: 28 ng/mL (insufficient, normal range 30-100 ng/mL). All other values normal.',
      keyFindings: ['Vitamin D deficiency (28 ng/mL)', 'Normal cholesterol levels', 'Normal blood glucose'],
      recommendations: ['Vitamin D3 supplementation 2000 IU daily', 'Increase sun exposure', 'Follow-up in 3 months']
    },
    {
      id: '2',
      title: 'Cardiology Visit Summary',
      type: 'visit_summary',
      date: '2024-01-10',
      doctor: 'Dr. Michael Brown',
      department: 'Cardiology',
      status: 'normal',
      summary: 'Routine cardiology follow-up for hypertension management',
      content: 'Patient presents for routine follow-up of hypertension. Blood pressure today: 142/88 mmHg. Patient reports good medication compliance. Discussed lifestyle modifications.',
      keyFindings: ['Blood pressure 142/88 mmHg', 'Good medication compliance', 'No chest pain or shortness of breath'],
      recommendations: ['Continue current medications', 'Reduce sodium intake', 'Regular exercise 30 min/day', 'Weight management', 'Follow-up in 6 weeks']
    },
    {
      id: '3',
      title: 'Current Prescriptions',
      type: 'prescription',
      date: '2024-01-10',
      doctor: 'Dr. Michael Brown',
      department: 'Cardiology',
      status: 'normal',
      summary: 'Updated prescription list following cardiology visit',
      content: 'Lisinopril 10mg once daily for hypertension. Atorvastatin 20mg once daily for cholesterol management. Aspirin 81mg once daily for cardiovascular protection.',
      keyFindings: ['Lisinopril 10mg daily', 'Atorvastatin 20mg daily', 'Aspirin 81mg daily'],
      recommendations: ['Take medications as prescribed', 'Monitor for side effects', 'Do not stop without consulting doctor']
    }
  ]);

  const [upcomingAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-01-20',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'confirmed',
      location: 'Cardiology Clinic, Room 205',
      notes: 'Bring current medication list'
    },
    {
      id: '2',
      doctor: 'Dr. Michael Brown',
      specialty: 'General Medicine',
      date: '2024-01-25',
      time: '2:15 PM',
      type: 'Annual Check-up',
      status: 'confirmed',
      location: 'General Medicine, Room 101'
    }
  ]);

  const getAppointmentDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Personalized Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Good {getTimeOfDay()}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-600 mt-1">Here's your health overview for today</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Activity className="h-4 w-4 inline mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('ai-assistant')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'ai-assistant'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' ? (
          <>
            {/* Health Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Next Appointment</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {getAppointmentDateLabel(upcomingAppointments[0]?.date)}
                    </p>
                    <p className="text-xs text-gray-500">{upcomingAppointments[0]?.time}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Medical Records</p>
                    <p className="text-lg font-semibold text-gray-900">{patientDocuments.length}</p>
                    <p className="text-xs text-gray-500">Recent documents</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Blood Pressure</p>
                    <p className="text-lg font-semibold text-gray-900">142/88</p>
                    <p className="text-xs text-yellow-600">Needs attention</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Pill className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Medications</p>
                    <p className="text-lg font-semibold text-gray-900">3</p>
                    <p className="text-xs text-gray-500">Current prescriptions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Appointments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Upcoming Appointments
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                            <p className="text-sm text-gray-600">{appointment.specialty} • {appointment.type}</p>
                            <p className="text-sm text-gray-500 mt-1">{appointment.location}</p>
                            {appointment.notes && (
                              <p className="text-xs text-blue-600 mt-2 bg-blue-100 px-2 py-1 rounded">
                                Note: {appointment.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{getAppointmentDateLabel(appointment.date)}</p>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mt-1">
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                    Schedule New Appointment
                  </button>
                </div>
              </div>

              {/* Recent Medical Documents */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    Recent Documents & Lab Results
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {patientDocuments.map((document) => (
                      <div key={document.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{document.title}</h3>
                            <p className="text-sm text-gray-600">{document.doctor} • {document.department}</p>
                            <p className="text-sm text-gray-500 mt-1">{format(parseISO(document.date), 'MMM d, yyyy')}</p>
                            {document.keyFindings && document.keyFindings.length > 0 && (
                              <p className="text-xs text-gray-600 mt-2">
                                Key: {document.keyFindings[0]}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              document.status === 'normal' 
                                ? 'bg-green-100 text-green-800' 
                                : document.status === 'abnormal'
                                ? 'bg-red-100 text-red-800'
                                : document.status === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {document.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                    View All Records
                  </button>
                </div>
              </div>
            </div>

            {/* AI Assistant Teaser */}
            <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ask Your AI Medical Assistant</h3>
                  <p className="text-purple-100 mb-4">
                    Get instant answers about your medical records, lab results, and visit summaries using natural language.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      "What were my last lab results?"
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      "What did my doctor recommend?"
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('ai-assistant')}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Try AI Assistant
                </button>
              </div>
            </div>
          </>
        ) : (
          /* AI Assistant Tab */
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Medical Assistant</h2>
              <p className="text-gray-600">
                Ask questions about your medical records in natural language. I can help you understand your lab results, 
                visit summaries, prescriptions, and more.
              </p>
            </div>
            <AIAssistant patientDocuments={patientDocuments} />
          </div>
        )}
      </div>
    </div>
  );
}