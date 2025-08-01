import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * A higher-order component that protects routes from unauthenticated access.
 * It can also check for specific roles (e.g., 'ADMIN').
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The component to render if authorized.
 * @param {string} [props.role] - The required role to access the route (e.g., 'ADMIN').
 */
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and user is not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    // If a specific role is required and the user doesn't have it, redirect
    if (!loading && isAuthenticated && role && user.role !== role) {
      router.push('/dashboard'); // Redirect to a default authenticated page
    }
  }, [isAuthenticated, loading, user, role, router]);

  // While loading, show a simple loading indicator or null
  if (loading || !isAuthenticated || (role && user.role !== role)) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  // If authenticated and authorized, render the children components
  return children;
};

export default ProtectedRoute;