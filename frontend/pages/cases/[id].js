import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/context/AuthContext';
import CaseStatusBadge from '@/components/cases/CaseStatusBadge';
import { PaperClipIcon, UserIcon, UsersIcon } from '@heroicons/react/24/solid';

export default function CaseDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCaseDetails = async () => {
        try {
          const { data } = await api.get(`/cases/${id}`);
          setCaseDetails(data);
        } catch (error) {
          console.error('Failed to fetch case details:', error);
          toast.error('Could not load case details.');
        } finally {
          setLoading(false);
        }
      };
      fetchCaseDetails();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Loading case details...</div>;
  }

  if (!caseDetails) {
    return <div className="text-center p-10">Case not found.</div>;
  }

  const { user, opposite_parties, evidence } = caseDetails;

  return (
    <ProtectedRoute>
      <Head>
        <title>Case #{caseDetails.id} - ResolveIt</title>
      </Head>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Case Details</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Case ID: #{caseDetails.id}</p>
            </div>
            <CaseStatusBadge status={caseDetails.status} />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{caseDetails.description}</dd>
            </div>

            {/* Parties */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Parties Involved</h3>
                <div className="flex items-start">
                    <UserIcon className="h-6 w-6 text-primary mr-3" />
                    <div>
                        <p className="font-semibold">{user.name} (Claimant)</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <UsersIcon className="h-6 w-6 text-red-500 mr-3" />
                    <div>
                        <p className="font-semibold">{opposite_parties[0]?.name} (Opposite Party)</p>
                        <p className="text-sm text-gray-500">{opposite_parties[0]?.email || 'No email provided'}</p>
                    </div>
                </div>
            </div>

            {/* Evidence */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Evidence</h3>
              <ul role="list" className="mt-2 border border-gray-200 dark:border-gray-600 rounded-md divide-y divide-gray-200 dark:divide-gray-600">
                {evidence.length > 0 ? evidence.map((file) => (
                  <li key={file.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span className="ml-2 flex-1 w-0 truncate">{file.file_url.split('/').pop()}</span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a href={`${process.env.NEXT_PUBLIC_API_URL}${file.file_url}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:text-primary-dark">
                        Download
                      </a>
                    </div>
                  </li>
                )) : <li className="p-3 text-sm text-gray-500">No evidence uploaded.</li> }
              </ul>
            </div>
          </dl>
        </div>
      </div>
    </ProtectedRoute>
  );
}