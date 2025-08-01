/**
 * A component to display a case status with a color-coded badge.
 * @param {object} props - The props object.
 * @param {string} props.status - The case status string (e.g., 'REGISTERED', 'RESOLVED').
 */
const CaseStatusBadge = ({ status }) => {
  const statusStyles = {
    REGISTERED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    AWAITING_RESPONSE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    PANEL_CREATED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    MEDIATION_IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    RESOLVED: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    UNRESOLVED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const formattedStatus = status.replace(/_/g, ' ').toUpperCase();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {formattedStatus}
    </span>
  );
};

export default CaseStatusBadge;
