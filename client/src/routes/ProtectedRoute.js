import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowRoles }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/signin" replace />;
  if (allowRoles && !allowRoles.includes(auth.role))
     return <Navigate to="/" replace />;
  return <Outlet />;
}
// Note: This component should be used to wrap routes that require authentication.
// It checks if the user is authenticated and has the required role (if specified).
// If the user is not authenticated, it redirects to the sign-in page.
// If the user is authenticated but does not have the required role, it redirects to an unauthorized page.
// The `loading` state is used to prevent rendering while the authentication status is being determined.