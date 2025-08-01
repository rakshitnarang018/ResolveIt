import Head from 'next/head';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import FormikInput from '@/components/forms/FormikInput';
import api from '@/context/AuthContext';

// --- Validation Schemas for each step ---
const stepOneSchema = Yup.object({
  case_type: Yup.string().required('Case type is required'),
  description: Yup.string().required('A detailed description is required'),
});

const stepTwoSchema = Yup.object({
  opposite_party_name: Yup.string().required("Opposite party's name is required"),
  opposite_party_email: Yup.string().email('Invalid email format'),
  opposite_party_phone: Yup.string(),
});

const stepThreeSchema = Yup.object({
  is_pending_in_court: Yup.boolean().required(),
  case_number: Yup.string().when('is_pending_in_court', {
    is: true,
    then: (schema) => schema.required('Case/FIR number is required when a case is pending'),
    otherwise: (schema) => schema.optional(),
  }),
  institution_name: Yup.string().when('is_pending_in_court', {
    is: true,
    then: (schema) => schema.required('Court/Police Station name is required'),
    otherwise: (schema) => schema.optional(),
  }),
});

const stepFourSchema = Yup.object({
    evidence: Yup.mixed().nullable(),
});

const validationSchemas = [stepOneSchema, stepTwoSchema, stepThreeSchema, stepFourSchema];

export default function RegisterCasePage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();

    // Append all form values to FormData
    Object.keys(values).forEach(key => {
        if (key !== 'evidence') {
            formData.append(key, values[key]);
        }
    });

    // Append files
    if (values.evidence) {
        for (let i = 0; i < values.evidence.length; i++) {
            formData.append('evidence', values.evidence[i]);
        }
    }
    
    setSubmitting(true);
    try {
        const { data } = await api.post('/cases/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success('Case registered successfully!');
        router.push(`/cases/${data.id}`);
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to register case.';
        toast.error(message);
        console.error(error);
    } finally {
        setSubmitting(false);
    }
  };

  const initialValues = {
    case_type: 'FAMILY',
    description: '',
    opposite_party_name: '',
    opposite_party_email: '',
    opposite_party_phone: '',
    is_pending_in_court: false,
    case_number: '',
    institution_name: '',
    evidence: null,
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Register a New Case - ResolveIt</title>
      </Head>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Register a New Case</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Step {step + 1} of 4</p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[step]}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              {step === 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Case Details</h2>
                  <div>
                    <label htmlFor="case_type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Case Type</label>
                    <select id="case_type" name="case_type" onChange={(e) => setFieldValue('case_type', e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option>FAMILY</option>
                        <option>BUSINESS</option>
                        <option>CRIMINAL</option>
                        <option>COMMUNITY</option>
                        <option>OTHER</option>
                    </select>
                  </div>
                  <FormikInput label="Issue Description" name="description" as="textarea" rows={4} required />
                </section>
              )}

              {step === 1 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Opposite Party Information</h2>
                  <FormikInput label="Full Name" name="opposite_party_name" type="text" required />
                  <FormikInput label="Email (Optional)" name="opposite_party_email" type="email" />
                  <FormikInput label="Phone (Optional)" name="opposite_party_phone" type="tel" />
                </section>
              )}

              {step === 2 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Judicial Status</h2>
                  <div role="group" aria-labelledby="is_pending_in_court-label">
                    <label id="is_pending_in_court-label" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Is this issue pending in a judicial court or police station?</label>
                    <div className="mt-2 space-x-4">
                        <label className="inline-flex items-center">
                            <input type="radio" name="is_pending_in_court" checked={values.is_pending_in_court === true} onChange={() => setFieldValue('is_pending_in_court', true)} className="form-radio h-4 w-4 text-primary focus:ring-primary-dark" />
                            <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" name="is_pending_in_court" checked={values.is_pending_in_court === false} onChange={() => setFieldValue('is_pending_in_court', false)} className="form-radio h-4 w-4 text-primary focus:ring-primary-dark" />
                            <span className="ml-2">No</span>
                        </label>
                    </div>
                  </div>
                  {values.is_pending_in_court && (
                    <div className="mt-4 space-y-4">
                      <FormikInput label="Case / FIR Number" name="case_number" type="text" required />
                      <FormikInput label="Court / Police Station Name" name="institution_name" type="text" required />
                    </div>
                  )}
                </section>
              )}

              {step === 3 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Upload Evidence</h2>
                  <p className="text-sm text-gray-500 mb-2">Upload images, videos, audio, or documents as proof.</p>
                  <input
                    id="evidence"
                    name="evidence"
                    type="file"
                    multiple
                    onChange={(event) => {
                      setFieldValue("evidence", event.currentTarget.files);
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-cyan-200"
                  />
                </section>
              )}

              <div className="flex justify-between mt-8">
                {step > 0 && (
                  <button type="button" onClick={handleBack} className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    Back
                  </button>
                )}
                {step < 3 && (
                  <button type="button" onClick={handleNext} className="ml-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                    Next
                  </button>
                )}
                {step === 3 && (
                  <button type="submit" disabled={isSubmitting} className="ml-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit Case'}
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </ProtectedRoute>
  );
}