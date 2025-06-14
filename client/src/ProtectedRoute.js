import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  // Prevent rendering if auth is undefined (AuthProvider not set properly)
  if (!auth) {
    console.error('ProtectedRoute: AuthContext is undefined. Did you forget to wrap your app in <AuthProvider>?');
    return <Navigate to="/signin" replace />;
  }

  const { token } = auth;

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
