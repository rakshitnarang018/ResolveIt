import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRightIcon, ScaleIcon } from '@heroicons/react/24/solid';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <Head>
        <title>ResolveIt - Fair Dispute Resolution</title>
        <meta name="description" content="A platform for fair and transparent dispute resolution through mediation." />
      </Head>

      <div className="text-center">
        <div className="flex justify-center items-center mb-6">
          <ScaleIcon className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
          Welcome to <span className="text-primary">ResolveIt</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          Your trusted platform for resolving disputes with fairness and transparency. We connect you with experts to find amicable solutions.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          {isAuthenticated ? (
            <Link href={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-transform transform hover:scale-105">
                Go to Your Dashboard
                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-dark bg-primary-light hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-transform transform hover:scale-105">
                  Login
              </Link>
              <Link href="/register" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-transform transform hover:scale-105">
                  Get Started
                  <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}