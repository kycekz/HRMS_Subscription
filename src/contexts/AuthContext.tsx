import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, Employee, MessUser } from '../lib/supabase';

type AuthContextType = {
  messUser: MessUser | null;
  employee: Employee | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_SESSION_KEY = 'hrms_auth_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [messUser, setMessUser] = useState<MessUser | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const storedSession = localStorage.getItem(AUTH_SESSION_KEY);
      if (storedSession) {
        try {
          const sessionData = JSON.parse(storedSession);
          const { data, error } = await supabase
            .from('mess_tbl')
            .select(`
              *,
              mtent_tbl!inner(mtent_name)
            `)
            .eq('mess_id', sessionData.mess_id)
            .maybeSingle();

          if (!error && data) {
            //console.log('Session user data:', data);
            setMessUser(data);
            if (data.mess_empid) {
              await fetchEmployee(data.mess_empid);
            } else {
              setLoading(false);
            }
          } else {
            localStorage.removeItem(AUTH_SESSION_KEY);
            setLoading(false);
          }
        } catch (err) {
          console.error('Session check error:', err);
          localStorage.removeItem(AUTH_SESSION_KEY);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const fetchEmployee = async (employeeId: string) => {
    try {
      //console.log('Fetching employee:', employeeId);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .maybeSingle();

      if (error) {
        console.error('Employee fetch error:', error);
        throw error;
      }
      
      //console.log('Employee data:', data);
      if (data) {
        setEmployee({ ...data, tentid: messUser?.tentid });
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase
      .from('mess_tbl')
      .select(`
        *,
        mtent_tbl!inner(mtent_name)
      `)
      .eq('mess_email', email)
      .eq('mess_is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Invalid email or password');

    if (data.mess_locked_until && new Date(data.mess_locked_until) > new Date()) {
      throw new Error('Account is locked. Please try again later.');
    }

    if (data.mess_password_hash !== password) {
      const newAttempts = data.mess_login_attempts + 1;
      await supabase
        .from('mess_tbl')
        .update({
          mess_login_attempts: newAttempts,
          mess_locked_until: newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null
        })
        .eq('mess_id', data.mess_id);
      throw new Error('Invalid email or password');
    }

    await supabase
      .from('mess_tbl')
      .update({
        mess_last_login: new Date().toISOString(),
        mess_login_attempts: 0,
        mess_locked_until: null
      })
      .eq('mess_id', data.mess_id);

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ 
      mess_id: data.mess_id,
      tenant_id: data.tentid 
    }));
    setMessUser(data);
    if (data.mess_empid) {
      await fetchEmployee(data.mess_empid);
    }
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    setMessUser(null);
    setEmployee(null);
  };

  return (
    <AuthContext.Provider value={{ messUser, employee, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
