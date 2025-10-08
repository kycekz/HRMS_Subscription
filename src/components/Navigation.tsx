import { Clock, FileText, Users, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type NavigationProps = {
  activeTab: 'clock' | 'timesheet' | 'team' | 'leave';
  onTabChange: (tab: 'clock' | 'timesheet' | 'team' | 'leave') => void;
};

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { messUser } = useAuth();
  //console.log('User role:', messUser?.mess_role);
  const isAdmin = messUser?.mess_role === 'ADMIN' || messUser?.mess_role === 'OWNER';
  //console.log('Is admin:', isAdmin);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-1">
          <button
            onClick={() => onTabChange('clock')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition border-b-2 ${
              activeTab === 'clock'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <Clock className="w-5 h-5" />
            Clock In/Out
          </button>
          <button
            onClick={() => onTabChange('timesheet')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition border-b-2 ${
              activeTab === 'timesheet'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            Timesheet
          </button>
          <button
            onClick={() => onTabChange('leave')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition border-b-2 ${
              activeTab === 'leave'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Leave
          </button>
          {isAdmin && (
            <button
              onClick={() => onTabChange('team')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition border-b-2 ${
                activeTab === 'team'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              My Team
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
