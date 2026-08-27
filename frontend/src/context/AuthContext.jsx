import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile } from '../api/authApi';
import { getCaptainProfile } from '../api/captainApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session

  // ── Restore session from localStorage on mount ──
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem('rt_token');
        const storedUser = localStorage.getItem('rt_user');
        const storedCaptain = localStorage.getItem('rt_captain');

        if (!token) {
          setLoading(false);
          return;
        }

        if (storedUser) {
          // Quick restore from cache, then verify with backend
          setUser(JSON.parse(storedUser));
          try {
            const { data } = await getUserProfile();
            setUser(data.user);
            localStorage.setItem('rt_user', JSON.stringify(data.user));
          } catch {
            // Token invalid — clear everything
            clearSession();
          }
        } else if (storedCaptain) {
          setCaptain(JSON.parse(storedCaptain));
          try {
            const { data } = await getCaptainProfile();
            setCaptain(data.captain);
            localStorage.setItem('rt_captain', JSON.stringify(data.captain));
          } catch {
            clearSession();
          }
        }
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Login user ──
  const loginUser = useCallback((token, userData) => {
    localStorage.setItem('rt_token', token);
    localStorage.setItem('rt_user', JSON.stringify(userData));
    localStorage.removeItem('rt_captain');
    setUser(userData);
    setCaptain(null);
  }, []);

  // ── Login captain ──
  const loginCaptain = useCallback((token, captainData) => {
    localStorage.setItem('rt_token', token);
    localStorage.setItem('rt_captain', JSON.stringify(captainData));
    localStorage.removeItem('rt_user');
    setCaptain(captainData);
    setUser(null);
  }, []);

  // ── Clear all session data ──
  const clearSession = useCallback(() => {
    localStorage.removeItem('rt_token');
    localStorage.removeItem('rt_user');
    localStorage.removeItem('rt_captain');
    setUser(null);
    setCaptain(null);
  }, []);

  const isAuthenticated = !!user;
  const isCaptainAuthenticated = !!captain;

  return (
    <AuthContext.Provider
      value={{
        user,
        captain,
        loading,
        isAuthenticated,
        isCaptainAuthenticated,
        loginUser,
        loginCaptain,
        clearSession,
        setUser,
        setCaptain,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
