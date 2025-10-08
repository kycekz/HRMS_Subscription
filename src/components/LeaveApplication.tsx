import { useState, useEffect } from 'react';
import { Calendar, FileText, Send, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTenantSupabase, LeaveType, LeaveBalance } from '../utils/tenantAwareSupabase';
import { supabase } from '../lib/supabase';

interface LeaveApplicationProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function LeaveApplication({ onClose, onSuccess }: LeaveApplicationProps) {
  const { messUser } = useAuth();
  const tenantDb = useTenantSupabase();
  
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  //const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
  });
  
  const [calculatedDays, setCalculatedDays] = useState({
    totalDays: 0,
    workingDays: 0,
  });

  useEffect(() => {
    //console.log('🚀 LeaveApplication useEffect triggered');
    fetchLeaveTypes();
    fetchLeaveBalances();
  }, [messUser]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      calculateDays();
    }
  }, [formData.startDate, formData.endDate]);

  const fetchLeaveTypes = async () => {
    //console.log('🔍 fetchLeaveTypes called');
    //console.log('👤 messUser:', messUser);
    
    if (!messUser?.mess_email) {
      //console.log('❌ No mess_email found');
      return;
    }
    
    try {
      //console.log('📞 Calling direct query with:', {mess_email: messUser.mess_email,tentid: messUser.tentid});
      
      const { data, error } = await supabase
        .from('telp_tbl')
        .select(`
          telp_empid,
          telp_lpgid,
          telp_efform,
          mlpg_tbl!inner(
            mlpg_lpgid,
            mler_tbl!inner(
              mler_letid,
              mler_yfrom,
              mler_yto,
              mlet_tbl!inner(
                mlet_letid,
                mlet_name
              )
            )
          ),
          employees!inner(
            id,
            mess_tbl!inner(
              mess_id,
              mess_email
            )
          )
        `)
        .eq('employees.mess_tbl.mess_email', messUser.mess_email)
        .eq('employees.mess_tbl.tentid', messUser.tentid);
      
      //console.log('📊 Query Response:', { data, error });
      
      if (error) {
        console.error('❌ Query Error:', error);
        throw error;
      }
      
      // Extract unique leave types
      const leaveTypesSet = new Set();
      const extractedTypes: LeaveType[] = [];
      
      //console.log('🔄 Processing data rows:', data?.length || 0);
      
      data?.forEach((row: any, index: number) => {
        //console.log(`📝 Row ${index}:`, row);
        row.mlpg_tbl?.mler_tbl?.forEach((rule: any) => {
          const leaveType = rule.mlet_tbl;
          if (leaveType && !leaveTypesSet.has(leaveType.mlet_letid)) {
            leaveTypesSet.add(leaveType.mlet_letid);
            const extractedType = {
              MLET_LETID: leaveType.mlet_letid,
              MLET_NAME: leaveType.mlet_name,
              MLET_CODE: leaveType.mlet_name?.split(' ').map((w: string) => w[0]).join('') || 'N/A',
              MLET_MEDCERT: false,
              MLET_PAYROLL: true
            };
            //console.log('➕ Adding leave type:', extractedType);
            extractedTypes.push(extractedType);
          }
        });
      });
      
      //console.log('✅ Final leave types:', extractedTypes);
      setLeaveTypes(extractedTypes);
    } catch (err) {
      console.error('💥 Error fetching leave types:', err);
    }
  };

  const fetchLeaveBalances = async () => {
    if (!messUser?.mess_empid) return;
    
    try {
      // First get employee_id from employees table
      const { data: empData, error: empError } = await supabase
        .from('employees')
        .select('employee_id')
        .eq('id', messUser.mess_empid)
        .single();
      
      if (empError) throw empError;
      if (!empData?.employee_id) return;

      //console.log('🔍 Employee ID found:', empData.employee_id);
      
      // Then get leave balances using employee_id
      const currentYear = new Date().getFullYear();
      //console.log('📅 Querying leave balances for year:', currentYear);
      
      const { data, error } = await supabase
        .from('telb_tbl')
        .select('*')
        .eq('telb_empid', empData.employee_id)
        .eq('telb_balyr', currentYear);
      
      //console.log('📊 Leave balances query result:', { data, error });
      
      if (error) throw error;
      //console.log('✅ Setting leave balances:', data || []);
      setLeaveBalances(data || []);
    } catch (err) {
      console.error('Error fetching leave balances:', err);
    }
  };

  const calculateDays = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (start > end) {
      setCalculatedDays({ totalDays: 0, workingDays: 0 });
      return;
    }
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const workingDays = tenantDb.calculateWorkingDays(formData.startDate, formData.endDate);
    
    setCalculatedDays({ totalDays, workingDays });
  };

  const getAvailableBalance = (leaveTypeId: string): number => {
    //console.log('🔍 Getting balance for leave type:', leaveTypeId);
    //console.log('📋 Available leave balances:', leaveBalances);
    
    const balance = leaveBalances.find(b => {
      //console.log('🔄 Checking balance:', b, 'against leave type:', leaveTypeId);
      return (b as any).telb_letid === leaveTypeId;
    });
    
    //console.log('💰 Found balance:', balance);
    const availableBalance = (balance as any)?.telb_currbal || 0;
    //console.log('✅ Returning available balance:', availableBalance);
    
    return availableBalance;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messUser?.mess_empid) return;
    
    setSubmitting(true);
    try {
      /*
      const applicationData = {
        tlea_empid: messUser.mess_empid,
        tlea_letid: formData.leaveTypeId,
        tlea_start: formData.startDate,
        tlea_end: formData.endDate,
        tlea_TTLDAY: calculatedDays.totalDays,
        tlea_WRKDAY: calculatedDays.workingDays,
        tlea_reason: formData.reason,
        tlea_status: 'SUBMITTED' as const,
        tlea_appdt: new Date().toISOString(),
      };*/

      const { error } = await supabase.from('tlea_tbl').insert({
        tlea_empid: messUser.mess_empid,
        tlea_letid: formData.leaveTypeId,
        tlea_start: formData.startDate,
        tlea_end: formData.endDate,
        tlea_ttlday: calculatedDays.totalDays,
        tlea_wrkday: calculatedDays.workingDays,
        tlea_reason: formData.reason,
        tlea_status: 'SUBMITTED',
        tlea_appdt: new Date().toISOString(),
      });
      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error submitting leave application:', err);
      alert('Failed to submit leave application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedLeaveType = leaveTypes.find(lt => lt.MLET_LETID === formData.leaveTypeId);
  const availableBalance = formData.leaveTypeId ? getAvailableBalance(formData.leaveTypeId) : 0;
  const isBalanceInsufficient = calculatedDays.workingDays > availableBalance;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Apply for Leave</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Leave Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type *
            </label>
            <select
              value={formData.leaveTypeId}
              onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select leave type</option>
              {leaveTypes.map(type => (
                <option key={type.MLET_LETID} value={type.MLET_LETID}>
                  {type.MLET_NAME} ({type.MLET_CODE})
                </option>
              ))}
            </select>
            {formData.leaveTypeId && (
              <div className="mt-2 text-sm text-gray-600">
                Available balance: <span className="font-medium">{availableBalance} days</span>
                {selectedLeaveType?.MLET_MEDCERT && (
                  <span className="ml-2 text-amber-600">• Medical certificate required</span>
                )}
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={(() => {
                    const today = new Date();
                    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                    const yearStart = new Date(today.getFullYear(), 0, 1);
                    return oneMonthAgo > yearStart ? oneMonthAgo.toISOString().split('T')[0] : yearStart.toISOString().split('T')[0];
                  })()}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={formData.startDate || (() => {
                    const today = new Date();
                    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                    const yearStart = new Date(today.getFullYear(), 0, 1);
                    return oneMonthAgo > yearStart ? oneMonthAgo.toISOString().split('T')[0] : yearStart.toISOString().split('T')[0];
                  })()}
                  max={new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </div>

          {/* Days Calculation */}
          {(formData.startDate && formData.endDate) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Days:</span>
                  <span className="ml-2 font-medium">{calculatedDays.totalDays}</span>
                </div>
                <div>
                  <span className="text-gray-600">Working Days:</span>
                  <span className="ml-2 font-medium">{calculatedDays.workingDays}</span>
                </div>
              </div>
              {isBalanceInsufficient && (
                <div className="mt-2 text-sm text-red-600">
                  ⚠️ Insufficient leave balance. Required: {calculatedDays.workingDays} days, Available: {availableBalance} days
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Please provide reason for leave application..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || isBalanceInsufficient || !formData.leaveTypeId || !formData.startDate || !formData.endDate || !formData.reason}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}