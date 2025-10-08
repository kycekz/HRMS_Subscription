import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
//import { supabase, ClockEvent } from '../lib/supabase';
import { supabase } from '../lib/supabase';

type DailyRecord = {
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  breakMinutes: number;
  workHours: number;
  status: 'ON_TIME' | 'LATE' | 'OVERTIME' | 'INCOMPLETE';
};

export function Timesheet() {
  const { employee, messUser } = useAuth();
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employee && messUser) {
      fetchTimesheet();
    }
  }, [employee, messUser]);

  const fetchTimesheet = async () => {
    if (!employee || !messUser) return;

    setLoading(true);
    try {
      //console.log('Fetching timesheet for:', { tentid: messUser.tentid, empid: employee.id });
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const { data, error } = await supabase
        .from('ttat_tbl')
        .select('*')
        .eq('tentid', messUser.tentid)
        .eq('ttat_empid', employee.id)
        .gte('ttat_date', startDate.toISOString().split('T')[0])
        .order('ttat_date', { ascending: false });

      if (error) throw error;

      //console.log('Timesheet data:', data);
      const dailyRecords = processAttendanceRecords(data || []);
      setRecords(dailyRecords);
    } catch (err) {
      console.error('Error fetching timesheet:', err);
    } finally {
      setLoading(false);
    }
  };

  const processAttendanceRecords = (records: any[]): DailyRecord[] => {
    return records.map(record => {
      const breakMinutes = record.ttat_total_break ? 
        Math.round(parseInterval(record.ttat_total_break) / 60) : 0;
      
      const workHours = record.ttat_work_duration ? 
        Math.round((parseInterval(record.ttat_work_duration) / 3600) * 100) / 100 : 0;

      let status: DailyRecord['status'] = 'INCOMPLETE';
      
      if (record.ttat_clock_in_time && record.ttat_clock_out_time) {
        const clockInTime = new Date(record.ttat_clock_in_time);
        const clockInHour = clockInTime.getHours();
        const clockInMinute = clockInTime.getMinutes();

        if (clockInHour < 9 || (clockInHour === 9 && clockInMinute === 0)) {
          status = 'ON_TIME';
        } else {
          status = 'LATE';
        }

        if (workHours > 9) {
          status = 'OVERTIME';
        }
      }

      return {
        date: record.ttat_date,
        clockIn: record.ttat_clock_in_time,
        clockOut: record.ttat_clock_out_time,
        breakMinutes,
        workHours,
        status,
      };
    }).sort((a, b) => b.date.localeCompare(a.date));
  };

  const parseInterval = (interval: string): number => {
    if (!interval) return 0;
    const match = interval.match(/(\d+):(\d+):(\d+)/);
    if (!match) return 0;
    const [, hours, minutes, seconds] = match;
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  };

  const getStatusColor = (status: DailyRecord['status']) => {
    switch (status) {
      case 'ON_TIME':
        return 'bg-green-100 text-green-700';
      case 'LATE':
        return 'bg-red-100 text-red-700';
      case 'OVERTIME':
        return 'bg-blue-100 text-blue-700';
      case 'INCOMPLETE':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading timesheet...</div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Yet</h3>
        <p className="text-gray-600">Start clocking in to see your attendance history</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-900">Last 7 Days</h2>
      </div>

      {records.map((record) => (
        <div key={record.date} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formatDate(record.date)}
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
              {record.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Clock In</p>
                <p className="text-sm font-medium text-gray-900">{formatTime(record.clockIn)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-xs text-gray-600">Clock Out</p>
                <p className="text-sm font-medium text-gray-900">{formatTime(record.clockOut)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-600">Break Time</p>
              <p className="text-sm font-medium text-gray-900">{record.breakMinutes} min</p>
            </div>

            <div>
              <p className="text-xs text-gray-600">Work Hours</p>
              <p className="text-sm font-medium text-gray-900">{record.workHours} hrs</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
