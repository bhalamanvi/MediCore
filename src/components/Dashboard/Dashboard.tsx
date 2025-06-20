import React from 'react';
import StatsCard from './StatsCard';
import { Users, UserCheck, Calendar, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Patients',
      value: '2,847',
      change: '12%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Doctors',
      value: '127',
      change: '3%',
      changeType: 'increase' as const,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Today\'s Appointments',
      value: '89',
      change: '8%',
      changeType: 'decrease' as const,
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Revenue (MTD)',
      value: '$127,450',
      change: '15%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'bg-teal-500'
    },
  ];

  const recentActivities = [
    { id: 1, type: 'appointment', message: 'New appointment scheduled with Dr. Smith', time: '2 minutes ago' },
    { id: 2, type: 'patient', message: 'Patient John Doe checked in', time: '5 minutes ago' },
    { id: 3, type: 'emergency', message: 'Emergency patient admitted to ICU', time: '8 minutes ago' },
    { id: 4, type: 'discharge', message: 'Patient Maria Garcia discharged', time: '15 minutes ago' },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'John Smith', doctor: 'Dr. Johnson', time: '10:30 AM', status: 'confirmed' },
    { id: 2, patient: 'Emma Wilson', doctor: 'Dr. Brown', time: '11:15 AM', status: 'pending' },
    { id: 3, patient: 'Michael Davis', doctor: 'Dr. Taylor', time: '2:00 PM', status: 'confirmed' },
    { id: 4, patient: 'Sarah Johnson', doctor: 'Dr. Wilson', time: '3:30 PM', status: 'confirmed' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, here's what's happening at your hospital today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.type === 'emergency' ? 'bg-red-500' :
                    activity.type === 'appointment' ? 'bg-blue-500' :
                    activity.type === 'patient' ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-xs text-gray-500">{appointment.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-blue-900">Add Patient</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 text-center">
            <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-900">Schedule Appointment</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 text-center">
            <UserCheck className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-purple-900">Add Doctor</span>
          </button>
          <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-red-900">Emergency Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
}