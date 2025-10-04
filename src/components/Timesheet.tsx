import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, ClockEvent } from '../lib/supabase';

type DailyRecord = {
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  breakMinutes: number;
  workHours: number;
  status: 'ON_TIME' | 'LATE' | 'OVERTIME' | 'INCOMPLETE';
};

export function Timesheet() {
  const { employee } = useAuth();
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employee) {
      fetchTimesheet();
    }
  }, [employee]);

  const fetchTimesheet = async () => {
    if (!employee) return;

    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const { data, error } = await supabase
        .from('clock_events')
        .select('*')
        .eq('employee_id', employee.id)
        .gte('event_time', startDate.toISOString())
        .order('event_time', { ascending: false });

      if (error) throw error;

      const dailyRecords = processDailyRecords(data || []);
      setRecords(dailyRecords);
    } catch (err) {
      console.error('Error fetching timesheet:', err);
    } finally {
      setLoading(false);
    }
  };

  const processDailyRecords = (events: ClockEvent[]): DailyRecord[] => {
    const recordsByDate = new Map<string, ClockEvent[]>();

    events.forEach(event => {
      const date = event.event_time.split('T')[0];
      if (!recordsByDate.has(date)) {
        recordsByDate.set(date, []);
      }
      recordsByDate.get(date)!.push(event);
    });

    const dailyRecords: DailyRecord[] = [];

    recordsByDate.forEach((dayEvents, date) => {
      const sortedEvents = dayEvents.sort((a, b) =>
        new Date(a.event_time).getTime() - new Date(b.event_time).getTime()
      );

      const clockInEvent = sortedEvents.find(e => e.event_type === 'CLOCK_IN');
      const clockOutEvent = sortedEvents.find(e => e.event_type === 'CLOCK_OUT');

      let breakMinutes = 0;
      let breakStart: Date | null = null;

      sortedEvents.forEach(event => {
        if (event.event_type === 'BREAK_IN') {
          breakStart = new Date(event.event_time);
        } else if (event.event_type === 'BREAK_OUT' && breakStart) {
          const breakEnd = new Date(event.event_time);
          breakMinutes += (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60);
          breakStart = null;
        }
      });

      let workHours = 0;
      let status: DailyRecord['status'] = 'INCOMPLETE';

      if (clockInEvent && clockOutEvent) {
        const totalMinutes = (new Date(clockOutEvent.event_time).getTime() -
                            new Date(clockInEvent.event_time).getTime()) / (1000 * 60);
        workHours = (totalMinutes - breakMinutes) / 60;

        const clockInTime = new Date(clockInEvent.event_time);
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

      dailyRecords.push({
        date,
        clockIn: clockInEvent?.event_time || null,
        clockOut: clockOutEvent?.event_time || null,
        breakMinutes: Math.round(breakMinutes),
        workHours: Math.round(workHours * 100) / 100,
        status,
      });
    });

    return dailyRecords.sort((a, b) => b.date.localeCompare(a.date));
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
