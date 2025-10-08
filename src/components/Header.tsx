import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  //const { employee, messUser, signOut } = useAuth();
  const {messUser, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{messUser?.mess_username}</h1>
            <p className="text-sm text-gray-600">{messUser?.mtent_tbl?.mtent_name || 'Company'} • {messUser?.mess_role} • {messUser?.mess_email} </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2 text-gray-700"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}
