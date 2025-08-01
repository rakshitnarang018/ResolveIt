import Head from 'next/head';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/context/AuthContext';
import FormikInput from '@/components/forms/FormikInput';

// --- Validation Schema using Yup ---
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  age: Yup.number().positive('Age must be a positive number').integer().min(18, 'You must be at least 18 years old').optional(),
  phone: Yup.string().optional(),
});

export default function RegisterPage() {
  const { register } = useAuth();

  return (
    <>
      <Head>
        <title>Create Account - ResolveIt</title>
      </Head>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                age: '',
                phone: '',
              }}
              validationSchema={RegisterSchema}
              onSubmit={(values, { setSubmitting }) => {
                // We don't send confirmPassword to the backend
                const { confirmPassword, ...userData } = values;
                register(userData);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <FormikInput label="Full Name" name="name" type="text" required />
                  <FormikInput label="Email address" name="email" type="email" required />
                  <FormikInput label="Password" name="password" type="password" required />
                  <FormikInput label="Confirm Password" name="confirmPassword" type="password" required />
                  <FormikInput label="Age (Optional)" name="age" type="number" />
                  <FormikInput label="Phone Number (Optional)" name="phone" type="tel" />

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
                    >
                      {isSubmitting ? 'Creating account...' : 'Create Account'}
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
