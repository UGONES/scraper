import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct

// Helper to decode token
const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
 const [user, setUser] = useState(() => {
  const t = localStorage.getItem('token');
  return t ? decodeToken(t) : null;
});


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const decoded = decodeToken(token);
      setUser(decoded);
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = (jwt) => {
    setToken(jwt);
    localStorage.setItem('token', jwt); 
  };

  const logout = () => {
    setToken('');
  };

  return (
<AuthContext.Provider
  value={{
    token,
    user,
    role: user?.role,
    isAuthenticated: !!user,
    login,
    logout,
  }}
>      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
