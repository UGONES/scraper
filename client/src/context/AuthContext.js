import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import jwtDecode from 'jwt-decode';
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
} from '../utils/authHelpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = getStoredAuth();
    if (stored?.token) {
      try {
        const decoded = jwtDecode(stored.token);
        return {
          token: stored.token,
          role: decoded.role,
          username: decoded.username,
          userId: decoded.userId || decoded.id,
        };
      } catch (err) {
        console.error("Invalid token on load:", err);
        clearStoredAuth();
      }
    }
    return null;
  });

  // 🔁 Memoized logout
  const logout = useCallback(() => {
    setAuth(null);
    clearStoredAuth();
  }, []);

  // 🔁 Memoized login
  const login = useCallback((payload) => {
    try {
      if (!payload) return;

      const token = typeof payload === 'string' ? payload : payload.token;
      const decoded = jwtDecode(token);

      if (!decoded?.role || !decoded?.username || (!decoded?.id && !decoded?.userId)) {
        throw new Error("Invalid token payload");
      }

      const cleanAuth = {
        token,
        role: decoded.role,
        username: decoded.username,
        userId: decoded.userId || decoded.id,
      };

      setAuth(cleanAuth);
      setStoredAuth(cleanAuth);
    } catch (err) {
      console.error("Auth login error:", err);
      logout();
    }
  }, [logout]);

  // Auto-expire token
  useEffect(() => {
    if (auth?.token) {
      try {
        const decoded = jwtDecode(auth.token);
        const exp = decoded.exp * 1000;
        const now = Date.now();
        const timeout = exp - now;

        if (timeout <= 0) {
          logout();
        } else {
          const timer = setTimeout(() => logout(), timeout);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error("Token decode error:", err);
        logout();
      }
    } else {
      clearStoredAuth();
    }
  }, [auth, logout]);

  // ✅ Fixes React warning: include login/logout in useMemo
  const value = useMemo(() => ({ auth, login, logout }), [auth, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
