import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Leave Application Types
export interface LeaveApplication {
  tlea_LEAID?: string;
  tlea_empid: string;
  tlea_letid: string;
  tlea_start: string;
  tlea_end: string;
  tlea_ttlday: number;
  tlea_wrkday: number;
  tlea_reason: string;
  tlea_status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  tlea_appby?: string;
  tlea_appdt?: string;
  tlea_rejrea?: string;
  tentid?: string;
}

export interface LeaveType {
  MLET_LETID: string;
  MLET_NAME: string;
  MLET_CODE: string;
  MLET_MEDCERT: boolean;
  MLET_PAYROLL: boolean;
}

export interface LeaveBalance {
  TELB_EMPID: string;
  TELB_LETID: string;
  TELB_BALYR: number;
  TELB_ENTDAY: number;
  TELB_USEDDAY: number;
  TELB_CURRBAL: number;
}

export const useTenantSupabase = () => {
  const { messUser } = useAuth();

  if (!messUser?.tentid) {
    throw new Error('No authenticated user or tenant context available');
  }

  const tenantFilter = (query: any) => {
    return query.eq('tentid', messUser.tentid);
  };

  // Helper function to calculate working days between dates
  const calculateWorkingDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        workingDays++;
      }
    }
    
    return workingDays;
  };

  return {
    // Helper functions
    calculateWorkingDays,
    tclock_tbl: {
      select: (columns = '*') => tenantFilter(supabase.from('tclock_tbl').select(columns)),
      insert: (data: any) => supabase.from('tclock_tbl').insert({ ...data, tentid: messUser.tentid }),
      update: (data: any) => tenantFilter(supabase.from('tclock_tbl').update(data)),
      delete: () => tenantFilter(supabase.from('tclock_tbl').delete()),
    },
    ttat_tbl: {
      select: (columns = '*') => tenantFilter(supabase.from('ttat_tbl').select(columns)),
      insert: (data: any) => supabase.from('ttat_tbl').insert({ ...data, tentid: messUser.tentid }),
      update: (data: any) => tenantFilter(supabase.from('ttat_tbl').update(data)),
      delete: () => tenantFilter(supabase.from('ttat_tbl').delete()),
    },
    employees: {
      select: (columns = '*') => tenantFilter(supabase.from('employees').select(columns)),
      insert: (data: any) => supabase.from('employees').insert({ ...data, tentid: messUser.tentid }),
      update: (data: any) => tenantFilter(supabase.from('employees').update(data)),
      delete: () => tenantFilter(supabase.from('employees').delete()),
    },
    // Leave Management Tables
    TLEA_TBL: {
      select: (columns = '*') => tenantFilter(supabase.from('TLEA_TBL').select(columns)),
      insert: (data: any) => supabase.from('TLEA_TBL').insert({ ...data, tentid: messUser.tentid }),
      update: (data: any) => tenantFilter(supabase.from('TLEA_TBL').update(data)),
      delete: () => tenantFilter(supabase.from('TLEA_TBL').delete()),
    },
    MLET_TBL: {
      select: (columns = '*') => tenantFilter(supabase.from('MLET_TBL').select(columns)),
      insert: (data: any) => supabase.from('MLET_TBL').insert({ ...data, tentid: messUser.tentid }),
      update: (data: any) => tenantFilter(supabase.from('MLET_TBL').update(data)),
      delete: () => tenantFilter(supabase.from('MLET_TBL').delete()),
    },
    TELB_TBL: {
      select: (columns = '*') => tenantFilter(supabase.from('TELB_TBL').select(columns)),
      insert: (data: any) => supabase.from('TELB_TBL').insert({ ...data, tentid: messUser.tentid }),
      update: (data: any) => tenantFilter(supabase.from('TELB_TBL').update(data)),
      delete: () => tenantFilter(supabase.from('TELB_TBL').delete()),
    },
    telp_tbl: {
      select: (columns = '*') => tenantFilter(supabase.from('telp_tbl').select(columns)),
      insert: (data: any) => supabase.from('telp_tbl').insert({ ...data, tentid: messUser.tentid }),
      update: (data: any) => tenantFilter(supabase.from('telp_tbl').update(data)),
      delete: () => tenantFilter(supabase.from('telp_tbl').delete()),
    },
  };
};