import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, UserCheck, Calendar, TrendingUp, DollarSign, Bed, Package, BarChart3 } from 'lucide-react';

export default function ManagementDashboard() {
  const { user } = useAuth();

  const hospitalStats = [
    {
      title: 'Total Patients',
      value: '2,847',
      change: '12%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Staff',
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
      icon: DollarSign,
      color: 'bg-teal-500'
    },
    {
      title: 'Bed Occupancy',
      value: '85%',
      change: '5%',
      changeType: 'increase' as const,
      icon: Bed,
      color: 'bg-orange-500'
    },
    {
      title: 'Inventory Items',
      value: '1,234',
      change: '2%',
      changeType: 'decrease' as const,
      icon: Package,
      color: 'bg-indigo-500'
    }
  ];

  const departmentPerformance = [
    { department: 'Emergency', patients: 45, satisfaction: 4.8, efficiency: 92 },
    { department: 'Cardiology', patients: 23, satisfaction: 4.9, efficiency: 95 },
    { department: 'Pediatrics', patients: 18, satisfaction: 4.7, efficiency: 88 },
    { department: 'Orthopedics', patients: 15, satisfaction: 4.6, efficiency: 90 }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'critical',
      message: 'ICU bed capacity at 95%',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Low inventory: Surgical masks',
      time: '15 minutes ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'Monthly report generated',
      time: '1 hour ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hospital Overview</h1>
              <p className="text-gray-600">Welcome back, {user?.name} • {user?.department}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Generate Report
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {hospitalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className={`text-sm mt-2 ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? '+' : '-'}{stat.change}
                    </p>
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
          {/* Department Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Department Performance</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {departmentPerformance.map((dept, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900">{dept.department}</h3>
                      <span className="text-sm text-gray-600">{dept.patients} patients today</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Satisfaction</p>
                        <p className="text-lg font-semibold text-gray-900">{dept.satisfaction}/5.0</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Efficiency</p>
                        <p className="text-lg font-semibold text-gray-900">{dept.efficiency}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">System Alerts</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      alert.type === 'critical' ? 'bg-red-500' :
                      alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Management Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Management Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-center">
              <UserCheck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-900">Staff Management</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 text-center">
              <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-900">Analytics</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 text-center">
              <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-900">Financial Reports</span>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 text-center">
              <Package className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-900">Inventory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}