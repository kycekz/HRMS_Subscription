import { useState, useEffect, useRef } from 'react';
import { Clock, Coffee, Camera, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, ClockEvent } from '../lib/supabase';
import { reverseGeocode } from '../utils/reverseGeocode';

type ClockStatus = {
  isClockedIn: boolean;
  isOnBreak: boolean;
  lastEvent: ClockEvent | null;
};

export function ClockInterface() {
  const { employee, messUser } = useAuth();
  const [status, setStatus] = useState<ClockStatus>({
    isClockedIn: false,
    isOnBreak: false,
    lastEvent: null,
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [eventType, setEventType] = useState<ClockEvent['event_type'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (employee) {
      fetchLastEvent();
      fetchRecentEvents();
    }
  }, [employee]);

  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [showCamera]);

  const fetchLastEvent = async () => {
    if (!employee || !messUser) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('tclock_tbl')
        .select('*')
        .eq('tentid', messUser.tentid)
        .eq('tclock_empid', employee.id)
        .gte('tclock_event_time', `${today}T00:00:00`)
        .order('tclock_event_time', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching last event:', error);
        return;
      }

      if (data) {
        setStatus({
          isClockedIn: data.tclock_event_type === 'CLOCK_IN' || data.tclock_event_type === 'BREAK_OUT',
          isOnBreak: data.tclock_event_type === 'BREAK_IN',
          lastEvent: {
            ...data,
            event_type: data.tclock_event_type,
            event_time: data.tclock_event_time,
          },
        });
      }
    } catch (err) {
      console.error('Error in fetchLastEvent:', err);
    }
  };

  const fetchRecentEvents = async () => {
    if (!employee || !messUser) return;

    try {
      //console.log('Fetching events for:', { tentid: messUser.tentid, empid: employee.id });
      const { data, error } = await supabase
        .from('tclock_tbl')
        .select('*')
        .eq('tentid', messUser.tentid)
        .eq('tclock_empid', employee.id)
        .order('tclock_event_time', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent events:', error);
        return;
      }

      //console.log('Found events:', data);
      setRecentEvents(data || []);
    } catch (err) {
      console.error('Error in fetchRecentEvents:', err);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = (): string => {
    if (!videoRef.current) return '';
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return '';
  };

  const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleClockAction = async (type: ClockEvent['event_type']) => {
    setEventType(type);
    setShowCamera(true);
    setError('');
  };

  const handleCapture = async () => {
    //console.log('handleCapture started', { employee, eventType });
    if (!employee || !eventType) {
      console.log('Missing employee or eventType');
      return;
    }

    setLoading(true);
    setError('');

    try {

      
      //console.log('Capturing photo...');
      const photoData = capturePhoto();
      //console.log('Photo captured, getting location...');
      
      const location = await getLocation();
      //console.log('Location obtained:', location);
      
      //console.log('Getting location name...');
      const locationName = await reverseGeocode(location.latitude, location.longitude);
      //console.log('Location name:', locationName);
      
      
      const deviceInfo = navigator.userAgent;
      const insertData = {
        tentid: messUser ? messUser.tentid : null,
        tclock_empid: employee.id,
        tclock_event_time: new Date().toISOString(),
        tclock_event_type: eventType,
        tclock_source: 'MOBILE_WEB',
        tclock_device_info: deviceInfo,
        tclock_location: `${location.latitude},${location.longitude}`,
        tclock_location_name: locationName,
        tclock_photo: photoData,
      };
      
      //console.log('Inserting data:', insertData);
      const { error } = await supabase.from('tclock_tbl').insert(insertData);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      //console.log('Insert successful, fetching events...');
      await fetchLastEvent();
      await fetchRecentEvents();
      setShowCamera(false);
      setEventType(null);
      //console.log('handleCapture completed successfully');
    } catch (err: any) {
      //console.error('handleCapture error:', err);
      setError(err.message || 'Failed to record clock event');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCamera(false);
    setEventType(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Clock Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.isClockedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {status.isClockedIn ? 'Clocked In' : 'Clocked Out'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Break Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.isOnBreak ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {status.isOnBreak ? 'On Break' : 'Working'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleClockAction('CLOCK_IN')}
          disabled={status.isClockedIn || loading}
          className="bg-green-600 text-white py-4 rounded-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Clock className="w-5 h-5" />
          Clock In
        </button>

        <button
          onClick={() => handleClockAction('CLOCK_OUT')}
          disabled={!status.isClockedIn || status.isOnBreak || loading}
          className="bg-red-600 text-white py-4 rounded-xl font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Clock className="w-5 h-5" />
          Clock Out
        </button>

        <button
          onClick={() => handleClockAction('BREAK_IN')}
          disabled={!status.isClockedIn || status.isOnBreak || loading}
          className="bg-amber-600 text-white py-4 rounded-xl font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Coffee className="w-5 h-5" />
          Start Break
        </button>

        <button
          onClick={() => handleClockAction('BREAK_OUT')}
          disabled={!status.isOnBreak || loading}
          className="bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Coffee className="w-5 h-5" />
          End Break
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Clock Events</h3>
        {recentEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600">Event</th>
                  <th className="text-left py-2 text-gray-600">Date</th>
                  <th className="text-left py-2 text-gray-600">Time</th>
                  <th className="text-left py-2 text-gray-600">Source</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event, index) => (
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
                    <td className="py-2 text-gray-900">
                      {new Date(event.tclock_event_time).toLocaleDateString()}
                    </td>
                    <td className="py-2 text-gray-900">
                      {new Date(event.tclock_event_time).toLocaleTimeString()}
                    </td>
                    <td className="py-2 text-gray-600">
                      {(event.tclock_location_name || event.tclock_location || '-').substring(0, 40)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No clock events found</p>
        )}
      </div>

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Take Photo</h3>
                </div>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full"
                />
              </div>
              <div className="p-4 space-y-3">
                <button
                  onClick={handleCapture}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Capture & Submit'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
