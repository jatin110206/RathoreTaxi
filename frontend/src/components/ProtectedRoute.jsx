import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FullPageLoader } from './Loader';

/**
 * Guard for Rider protected routes (/home, /book, /rides, /profile)
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isCaptainAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullPageLoader message="Authenticating session..." />;
  }

  // If captain is logged in, redirect them to captain dashboard
  if (isCaptainAuthenticated) {
    return <Navigate to="/captain/dashboard" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * Guard for Captain protected routes (/captain/dashboard, /captain/rides, /captain/profile)
 */
export function CaptainProtectedRoute({ children }) {
  const { isCaptainAuthenticated, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullPageLoader message="Authenticating captain session..." />;
  }

  // If regular user is logged in, redirect to user home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  if (!isCaptainAuthenticated) {
    return <Navigate to="/captain/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * Guard for Public auth pages (/login, /register, /captain/login, /captain/register)
 * Redirects already authenticated sessions away from login
 */
export function PublicOnlyRoute({ children, target = 'user' }) {
  const { isAuthenticated, isCaptainAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullPageLoader message="Checking authentication..." />;
  }

  if (target === 'captain' && isCaptainAuthenticated) {
    return <Navigate to="/captain/dashboard" replace />;
  }

  if (target === 'user' && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;
