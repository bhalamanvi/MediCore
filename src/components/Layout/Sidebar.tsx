import React from 'react';
import { 
  Home, 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  CreditCard, 
  Package, 
  Bed,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'patients', name: 'Patients', icon: Users },
  { id: 'doctors', name: 'Doctors', icon: UserCheck },
  { id: 'appointments', name: 'Appointments', icon: Calendar },
  { id: 'records', name: 'Medical Records', icon: FileText },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'inventory', name: 'Inventory', icon: Package },
  { id: 'rooms', name: 'Rooms & Beds', icon: Bed },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="bg-white shadow-lg h-full w-64 fixed left-0 top-0 z-30">
      <div className="flex items-center justify-center h-16 bg-blue-600">
        <h1 className="text-white text-xl font-bold">MediCore HMS</h1>
      </div>
      
      <nav className="mt-8">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-3 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4">
        <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </button>
      </div>
    </div>
  );
}