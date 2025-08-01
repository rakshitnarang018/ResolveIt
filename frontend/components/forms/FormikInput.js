import { useField } from 'formik';

/**
 * A reusable text input component for Formik forms.
 * It automatically handles field state and displays validation errors.
 * @param {object} props - The props object.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.name - The name of the field, must match Formik's initialValues.
 * @param {string} [props.type='text'] - The type of the input (e.g., 'text', 'email', 'password').
 * @param {string} [props.placeholder] - The placeholder text for the input.
 */
const FormikInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>.
  const [field, meta] = useField(props);

  const hasError = meta.touched && meta.error;

  return (
    <div>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div className="mt-1">
        <input
          {...field}
          {...props}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
            hasError
              ? 'border-red-500 text-red-600 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
          }`}
        />
      </div>
      {hasError ? (
        <p className="mt-2 text-sm text-red-600" id={`${props.name}-error`}>
          {meta.error}
        </p>
      ) : null}
    </div>
  );
};

export default FormikInput;