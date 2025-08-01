import Head from 'next/head';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/context/AuthContext';
import FormikInput from '@/components/forms/FormikInput';

// --- Validation Schema using Yup ---
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <>
      <Head>
        <title>Login - ResolveIt</title>
      </Head>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={(values, { setSubmitting }) => {
                login(values.email, values.password);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <FormikInput
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />

                  <FormikInput
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
                    >
                      {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}