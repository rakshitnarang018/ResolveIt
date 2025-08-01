import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ScaleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 text-primary-dark dark:text-primary-light">
              <ScaleIcon className="h-8 w-8" />
              <span className="text-2xl font-bold">ResolveIt</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary-light transition-colors">
              Home
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary-light transition-colors">
                My Cases
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link href="/admin/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary-light transition-colors">
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Auth buttons and User Info */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-gray-700 dark:text-gray-200">
                  Welcome, {user.name || user.email}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary-light transition-colors">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;