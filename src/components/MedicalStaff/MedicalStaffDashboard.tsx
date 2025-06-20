import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Calendar, FileText, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

export default function MedicalStaffDashboard() {
  const { user } = useAuth();

  const todayStats = [
    {
      title: 'Today\'s Patients',
      value: '12',
      change: '+2',
      changeType: 'increase' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Appointments',
      value: '8',
      change: '-1',
      changeType: 'decrease' as const,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Reviews',
      value: '5',
      change: '+3',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Urgent Cases',
      value: '2',
      change: '0',
      changeType: 'neutral' as const,
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const todayAppointments = [
    {
      id: 1,
      patient: 'John Smith',
      time: '9:00 AM',
      type: 'Follow-up',
      status: 'completed',
      room: 'Room 101'
    },
    {
      id: 2,
      patient: 'Emma Johnson',
      time: '10:30 AM',
      type: 'Consultation',
      status: 'in-progress',
      room: 'Room 102'
    },
    {
      id: 3,
      patient: 'Michael Brown',
      time: '2:00 PM',
      type: 'Check-up',
      status: 'scheduled',
      room: 'Room 101'
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      task: 'Review lab results for Emma Johnson',
      priority: 'high',
      dueTime: '11:00 AM'
    },
    {
      id: 2,
      task: 'Update prescription for John Smith',
      priority: 'medium',
      dueTime: '1:00 PM'
    },
    {
      id: 3,
      task: 'Complete discharge summary for Sarah Davis',
      priority: 'low',
      dueTime: '3:00 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Good morning, {user?.name}</h1>
              <p className="text-gray-600">{user?.specialization} • {user?.department}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Add Patient Note
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Emergency Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {todayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    {stat.change !== '0' && (
                      <p className={`text-sm mt-2 ${
                        stat.changeType === 'increase' ? 'text-green-600' : 
                        stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.changeType === 'increase' ? '+' : stat.changeType === 'decrease' ? '' : ''}{stat.change}
                      </p>
                    )}
                  </div>
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                      <p className="text-sm text-gray-600">{appointment.type} • {appointment.room}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{appointment.time}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : appointment.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Pending Tasks</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.task}</h3>
                      <p className="text-sm text-gray-600">Due: {task.dueTime}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority} priority
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
              <span className="text-sm font-medium text-blue-900">View Patients</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 text-center">
              <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-900">Medical Records</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 text-center">
              <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-900">Schedule</span>
            </button>
            <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 text-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-red-900">Urgent Cases</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}