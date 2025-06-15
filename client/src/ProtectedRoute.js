import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const auth = useAuth();

  // Check if AuthContext is available
  if (!auth) {
    console.error('ProtectedRoute: AuthContext is undefined. Did you forget to wrap your app in <AuthProvider>?');
    return <Navigate to="/signin" replace />;
  }

  const { token, role } = auth;

  // Redirect if not logged in
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Redirect if role doesn't match
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string, // Optional: 'admin' | 'user'
};

export default ProtectedRoute;
