import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CaseStatusBadge from '@/components/cases/CaseStatusBadge';
import api from '@/context/AuthContext'; // Import the configured axios instance
import { PlusIcon } from '@heroicons/react/24/solid';

const UserDashboard = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { data } = await api.get('/cases/mycases');
        setCases(data);
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <ProtectedRoute>
      <Head>
        <title>My Dashboard - ResolveIt</title>
      </Head>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}!</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">Here are your registered cases.</p>
          </div>
          <Link href="/cases/register" className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">
            <PlusIcon className="h-5 w-5" />
            Register New Case
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <li className="p-6 text-center">Loading your cases...</li>
            ) : cases.length > 0 ? (
              cases.map((caseItem) => (
                <li key={caseItem.id}>
                  <Link href={`/cases/${caseItem.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary truncate">
                          Case #{caseItem.id} - {caseItem.case_type}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <CaseStatusBadge status={caseItem.status} />
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            vs. {caseItem.opposite_parties[0]?.name || 'N/A'}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                          <p>
                            Registered on <time dateTime={caseItem.created_at}>{new Date(caseItem.created_at).toLocaleDateString()}</time>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">You have not registered any cases yet.</li>
            )}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserDashboard;
