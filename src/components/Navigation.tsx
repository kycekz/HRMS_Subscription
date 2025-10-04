import { Clock, FileText } from 'lucide-react';

type NavigationProps = {
  activeTab: 'clock' | 'timesheet';
  onTabChange: (tab: 'clock' | 'timesheet') => void;
};

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
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
        </div>
      </div>
    </nav>
  );
}
