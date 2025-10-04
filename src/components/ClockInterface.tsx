import { useState, useEffect, useRef } from 'react';
import { Clock, Coffee, Camera, MapPin, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, ClockEvent } from '../lib/supabase';

type ClockStatus = {
  isClockedIn: boolean;
  isOnBreak: boolean;
  lastEvent: ClockEvent | null;
};

export function ClockInterface() {
  const { employee } = useAuth();
  const [status, setStatus] = useState<ClockStatus>({
    isClockedIn: false,
    isOnBreak: false,
    lastEvent: null,
  });
  const [showCamera, setShowCamera] = useState(false);
  const [eventType, setEventType] = useState<ClockEvent['event_type'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (employee) {
      fetchLastEvent();
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
    if (!employee) return;

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('clock_events')
      .select('*')
      .eq('employee_id', employee.id)
      .gte('event_time', `${today}T00:00:00`)
      .order('event_time', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching last event:', error);
      return;
    }

    if (data) {
      setStatus({
        isClockedIn: data.event_type === 'CLOCK_IN' || data.event_type === 'BREAK_OUT',
        isOnBreak: data.event_type === 'BREAK_IN',
        lastEvent: data,
      });
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
    if (!employee || !eventType) return;

    setLoading(true);
    setError('');

    try {
      const photoData = capturePhoto();
      const location = await getLocation();
      const deviceInfo = navigator.userAgent;

      const { error } = await supabase.from('clock_events').insert({
        employee_id: employee.id,
        event_type: eventType,
        event_time: new Date().toISOString(),
        source: 'MOBILE_WEB',
        latitude: location.latitude,
        longitude: location.longitude,
        photo_url: photoData,
        device_info: deviceInfo,
      });

      if (error) throw error;

      await fetchLastEvent();
      setShowCamera(false);
      setEventType(null);
    } catch (err: any) {
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

      {status.lastEvent && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Action</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Event:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {status.lastEvent.event_type.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Time:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {new Date(status.lastEvent.event_time).toLocaleTimeString()}
              </span>
            </div>
            {status.lastEvent.latitude && status.lastEvent.longitude && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                <span className="text-sm text-gray-900">
                  {status.lastEvent.latitude.toFixed(6)}, {status.lastEvent.longitude.toFixed(6)}
                </span>
              </div>
            )}
            {status.lastEvent.photo_url && (
              <div>
                <img
                  src={status.lastEvent.photo_url}
                  alt="Clock event photo"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}

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
