import Head from 'next/head';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/context/AuthContext';
import CaseStatusBadge from '@/components/cases/CaseStatusBadge';
import Link from 'next/link';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, casesRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/cases'),
        ]);
        setStats(statsRes.data);
        setCases(casesRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ProtectedRoute role="ADMIN">
      <Head>
        <title>Admin Dashboard - ResolveIt</title>
      </Head>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">Overview of all cases in the system.</p>
        </div>

        {/* Stats Cards */}
        {loading || !stats ? (
          <p>Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Cases</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.totalCases}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending Review</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">In Progress</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.inProgress}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Resolved</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.resolved}</p>
            </div>
          </div>
        )}

        {/* Cases Table */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white p-6">All Cases</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Case ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan="6" className="p-6 text-center">Loading cases...</td></tr>
                ) : cases.map((caseItem) => (
                  <tr key={caseItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">#{caseItem.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{caseItem.user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{caseItem.case_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><CaseStatusBadge status={caseItem.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(caseItem.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/cases/${caseItem.id}`} className="text-primary hover:text-primary-dark">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;