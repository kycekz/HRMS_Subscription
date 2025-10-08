import { useState } from 'react';
import { Calendar, Clock, FileText, X, Trash2, Ban } from 'lucide-react';
import { LeaveType } from '../utils/tenantAwareSupabase';
import { supabase } from '../lib/supabase';

interface LeaveApplicationDetailsProps {
  application: any;
  leaveTypes: LeaveType[];
  onClose: () => void;
  onSuccess: () => void;
}

export function LeaveApplicationDetails({ application, leaveTypes, onClose, onSuccess }: LeaveApplicationDetailsProps) {
  const [loading, setLoading] = useState(false);

  const getLeaveTypeName = (leaveTypeId: string): string => {
    const leaveType = leaveTypes.find(lt => lt.MLET_LETID === leaveTypeId);
    return leaveType ? `${leaveType.MLET_NAME} (${leaveType.MLET_CODE})` : 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this leave application?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tlea_tbl')
        .delete()
        .eq('tlea_leaid', application.tlea_leaid);
      
      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error deleting application:', err);
      alert('Failed to delete leave application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCancel = async () => {
    if (!confirm('Are you sure you want to request cancellation of this approved leave?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tlea_tbl')
        .update({ tlea_status: 'CANCELLED' })
        .eq('tlea_leaid', application.tlea_leaid);
      
      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error requesting cancellation:', err);
      alert('Failed to request cancellation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Leave Application Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Leave Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <p className="text-gray-900">{getLeaveTypeName(application.tlea_letid)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                application.tlea_status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                application.tlea_status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {application.tlea_status}
              </span>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4 text-gray-400" />
                {formatDate(application.tlea_start)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4 text-gray-400" />
                {formatDate(application.tlea_end)}
              </div>
            </div>
          </div>

          {/* Days Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Days:</span>
                <span className="ml-2 font-medium">{application.tlea_ttlday}</span>
              </div>
              <div>
                <span className="text-gray-600">Working Days:</span>
                <span className="ml-2 font-medium">{application.tlea_wrkday}</span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{application.tlea_reason}</p>
          </div>

          {/* Application Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Applied On</label>
            <div className="flex items-center gap-2 text-gray-900">
              <Clock className="w-4 h-4 text-gray-400" />
              {formatDate(application.tlea_appdt)}
            </div>
          </div>

          {/* Rejection Reason */}
          {application.tlea_status === 'REJECTED' && application.tlea_rejrsn && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-red-700 mb-1">Rejection Reason</label>
              <p className="text-red-600">{application.tlea_rejrsn}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Close
            </button>
            
            {application.tlea_status === 'SUBMITTED' && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                <Trash2 className="w-4 h-4" />
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            )}
            
            {application.tlea_status === 'APPROVED' && (
              <button
                onClick={handleRequestCancel}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                <Ban className="w-4 h-4" />
                {loading ? 'Requesting...' : 'Request Cancel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}