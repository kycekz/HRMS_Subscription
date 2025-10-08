import { useState, useEffect } from 'react';
import { Search, Users, Clock, FileText, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LeaveApplicationList } from './LeaveApplicationList';

type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  employee_id: string;
};

type ClockEvent = {
  tclock_id: string;
  tclock_event_time: string;
  tclock_event_type: string;
  tclock_source: string;
  tclock_location: string;
  tclock_location_name: string;
};

type AttendanceRecord = {
  ttat_date: string;
  ttat_clock_in_time: string;
  ttat_clock_out_time: string;
  ttat_total_break: string;
  ttat_work_duration: string;
};

export function MyTeam() {
  const { messUser } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'clocking' | 'timesheet' | 'leave'>('clocking');
  const [clockingData, setClockingData] = useState<ClockEvent[]>([]);
  const [timesheetData, setTimesheetData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (messUser) {
      fetchEmployees();
    }
  }, [messUser]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchEmployeeData();
    }
  }, [selectedEmployee, month, year, viewMode]);

  const fetchEmployees = async () => {
    if (!messUser) return;

    try {
      const { data, error } = await supabase
        .from('mess_tbl')
        .select(`
          mess_empid,
          employees!inner(id, first_name, last_name, email, employee_id)
        `)
        .eq('tentid', messUser.tentid)
        .order('employees(first_name)');

      if (error) throw error;
      
      //const employeeList = data?.map(item => item.employees).filter(Boolean) || [];
      const employeeList = data?.flatMap(item => item.employees) || [];
      setEmployees(employeeList);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchEmployeeData = async () => {
    if (!selectedEmployee || !messUser) return;

    setLoading(true);
    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      if (viewMode === 'clocking') {
        const { data, error } = await supabase
          .from('tclock_tbl')
          .select('*')
          .eq('tentid', messUser.tentid)
          .eq('tclock_empid', selectedEmployee.id)
          .gte('tclock_event_time', startDate)
          .lte('tclock_event_time', endDate + 'T23:59:59')
          .order('tclock_event_time', { ascending: false });

        if (error) throw error;
        setClockingData(data || []);
      } else {
        const { data, error } = await supabase
          .from('ttat_tbl')
          .select('*')
          .eq('tentid', messUser.tentid)
          .eq('ttat_empid', selectedEmployee.id)
          .gte('ttat_date', startDate)
          .lte('ttat_date', endDate)
          .order('ttat_date', { ascending: false });

        if (error) throw error;
        setTimesheetData(data || []);
      }
    } catch (err) {
      console.error('Error fetching employee data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const parseInterval = (interval: string): string => {
    if (!interval) return '0h 0m';
    const match = interval.match(/(\d+):(\d+):(\d+)/);
    if (!match) return '0h 0m';
    const [, hours, minutes] = match;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-900">My Team</h2>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="2020"
            max="2030"
          />
          <select
            value={selectedEmployee?.id || ''}
            onChange={(e) => {
              const emp = employees.find(emp => emp.id === e.target.value);
              setSelectedEmployee(emp || null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Employee</option>
            {filteredEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name} ({emp.employee_id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedEmployee && (
        <>
          {/* View Mode Toggle */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('clocking')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'clocking'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                Clocking
              </button>
              <button
                onClick={() => setViewMode('timesheet')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'timesheet'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Timesheet
              </button>
              <button
                onClick={() => setViewMode('leave')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'leave'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Leave Applications
              </button>
            </div>
          </div>

          {/* Data Display */}
          {viewMode === 'leave' ? (
            <LeaveApplicationList />
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedEmployee.first_name} {selectedEmployee.last_name} - {viewMode === 'clocking' ? 'Clock Events' : 'Attendance Summary'}
              </h3>

            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading...</div>
            ) : viewMode === 'clocking' ? (
              <div className="overflow-x-auto -mx-6 sm:mx-0 scrollbar-thin scrollbar-thumb-gray-300">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-600 min-w-[120px]">Event</th>
                      <th className="text-left py-2 text-gray-600 min-w-[120px]">Date</th>
                      <th className="text-left py-2 text-gray-600 min-w-[120px]">Time</th>
                      <th className="text-left py-2 text-gray-600 min-w-[120px]">Source</th>
                      <th className="text-left py-2 text-gray-600">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clockingData.map((event, index) => (
                      <tr key={event.tclock_id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            event.tclock_event_type === 'CLOCK_IN' ? 'bg-green-100 text-green-700' :
                            event.tclock_event_type === 'CLOCK_OUT' ? 'bg-red-100 text-red-700' :
                            event.tclock_event_type === 'BREAK_IN' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {event.tclock_event_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2 text-gray-900">{formatDate(event.tclock_event_time)}</td>
                        <td className="py-2 text-gray-900">{formatTime(event.tclock_event_time)}</td>
                        <td className="py-2 text-gray-600">{event.tclock_source}</td>
                        <td className="py-2 text-gray-600">{(event.tclock_location_name || event.tclock_location || '-').substring(0, 40)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {clockingData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No clock events found</div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-600">Date</th>
                      <th className="text-left py-2 text-gray-600">Clock In</th>
                      <th className="text-left py-2 text-gray-600">Clock Out</th>
                      <th className="text-left py-2 text-gray-600">Break Time</th>
                      <th className="text-left py-2 text-gray-600">Work Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timesheetData.map((record, index) => (
                      <tr key={record.ttat_date} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 text-gray-900">{formatDate(record.ttat_date)}</td>
                        <td className="py-2 text-gray-900">
                          {record.ttat_clock_in_time ? formatTime(record.ttat_clock_in_time) : '-'}
                        </td>
                        <td className="py-2 text-gray-900">
                          {record.ttat_clock_out_time ? formatTime(record.ttat_clock_out_time) : '-'}
                        </td>
                        <td className="py-2 text-gray-600">{parseInterval(record.ttat_total_break)}</td>
                        <td className="py-2 text-gray-600">{parseInterval(record.ttat_work_duration)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {timesheetData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No attendance records found</div>
                )}
              </div>
            )}
            </div>
          )}
        </>
      )}
    </div>
  );
}