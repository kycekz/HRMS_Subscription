import { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
//import { useTenantSupabase, LeaveApplication, LeaveType } from '../utils/tenantAwareSupabase';
import { LeaveApplication, LeaveType } from '../utils/tenantAwareSupabase';
import { LeaveApplication as LeaveApplicationForm } from './LeaveApplication';
import { LeaveApplicationDetails } from './LeaveApplicationDetails';
import { supabase } from '../lib/supabase';

export function LeaveApplicationList() {
  const { messUser } = useAuth();
  //const tenantDb = useTenantSupabase();
  
  const [applications, setApplications] = useState<(LeaveApplication & { leaveType?: LeaveType })[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [filter, setFilter] = useState<'ALL' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'>('ALL');

  useEffect(() => {
    //console.log('🚀 LeaveApplicationList useEffect triggered');
    fetchData();
  }, [messUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchApplications(), fetchLeaveTypes(), fetchLeaveBalances()]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
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
      
      // Then get leave balances using employee_id
      const currentYear = new Date().getFullYear();
      const { data, error } = await supabase
        .from('telb_tbl')
        .select('*')
        .eq('telb_empid', empData.employee_id)
        .eq('telb_balyr', currentYear);
      
      if (error) throw error;
      setLeaveBalances(data || []);
    } catch (err) {
      console.error('Error fetching leave balances:', err);
    }
  };

  const fetchApplications = async () => {
    if (!messUser?.mess_empid) return;
    
    try {
      const { data, error } = await supabase
        .from('tlea_tbl')
        .select('*')
        .eq('tlea_empid', messUser.mess_empid)
        .order('tlea_appdt', { ascending: false });
      
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const fetchLeaveTypes = async () => {
    //console.log('🔍 fetchLeaveTypes called in LeaveApplicationList');
    //console.log('👤 messUser:', messUser);
    
    if (!messUser?.mess_email) {
      console.log('❌ No user email found');
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

  const getLeaveTypeName = (leaveTypeId: string): string => {
    const leaveType = leaveTypes.find(lt => lt.MLET_LETID === leaveTypeId);
    return leaveType ? `${leaveType.MLET_NAME} (${leaveType.MLET_CODE})` : 'Unknown';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredApplications = applications.filter(app => 
    filter === 'ALL' || (app as any).tlea_status === filter
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Leave Applications</h2>
        </div>
        <div className="text-center py-8 text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Leave Applications</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Apply Leave
        </button>
      </div>

      {/* Leave Balance Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance Summary</h3>
        {leaveBalances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaveBalances.map((balance) => {
              const leaveType = leaveTypes.find(lt => lt.MLET_LETID === balance.telb_letid);
              return (
                <div key={balance.telb_letid} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {leaveType?.MLET_NAME || 'Unknown Leave Type'}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Entitled:</span>
                      <span className="font-medium">{balance.telb_entday || 0} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Used:</span>
                      <span className="font-medium">{balance.telb_usedday || 0} days</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span>Available:</span>
                      <span className="font-medium text-green-600">{balance.telb_currbal || 0} days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No leave balance information available</p>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-2 mb-4">
          {(['ALL', 'SUBMITTED', 'APPROVED', 'REJECTED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
              {status !== 'ALL' && (
                <span className="ml-2 text-xs">
                  ({applications.filter(app => (app as any).tlea_status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'ALL' 
                ? "You haven't submitted any leave applications yet."
                : `No ${filter.toLowerCase()} applications found.`
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mx-auto"
            >
              <Plus className="w-4 h-4" />
              Apply for Leave
            </button>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div 
              key={app.tlea_letid} 
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedApplication(app)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon((app as any).tlea_status)}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getLeaveTypeName((app as any).tlea_letid)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Applied on {formatDate((app as any).tlea_appdt || '')}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor((app as any).tlea_status)}`}>
                  {(app as any).tlea_status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>From: {formatDate(app.tlea_start)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>To: {formatDate(app.tlea_end)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{app.tlea_wrkday} working days</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                <p className="text-sm text-gray-600">{app.tlea_reason}</p>
              </div>

              {app.tlea_status === 'REJECTED' && app.tlea_rejrea && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-600">{app.tlea_rejrea}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Leave Application Form Modal */}
      {showForm && (
        <LeaveApplicationForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchData}
        />
      )}

      {/* Leave Application Details Modal */}
      {selectedApplication && (
        <LeaveApplicationDetails
          application={selectedApplication}
          leaveTypes={leaveTypes}
          onClose={() => setSelectedApplication(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}