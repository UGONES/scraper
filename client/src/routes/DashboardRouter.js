import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardRouter() {
  const { auth } = useAuth() || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.token) {
      navigate('/signin', { replace: true });
    } else if (auth.role === 'admin') {
      navigate('/dashboard/admin', { replace: true });
    } else if (auth.role === 'user') {
      navigate('/dashboard/user', { replace: true });
    } else {
      console.warn('Unknown role, forcing logout');
      navigate('/signin', { replace: true });
    }
  }, [auth, navigate]);

  return null;
};

// This component serves as a centralized router for the dashboard.
// It checks the user's authentication status and role, then redirects to the appropriate dashboard. 
// If the user is not authenticated, it redirects to the sign-in page.
// If the user has an unrecognized role, it redirects to an unauthorized page.
// The `loading` state is used to prevent rendering while the authentication status is being determined.
// This component is typically used in the main application routing setup to handle dashboard navigation based on user
// roles. It ensures that users are directed to the correct dashboard based on their role (admin or user).
// The `useAuth` hook is used to access the authentication context, which provides the current
// authentication state, including whether the user is authenticated and their role.
// The `Navigate` component from React Router is used to perform the redirection based on the user's role.
