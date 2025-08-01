const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {currentYear} ResolveIt. All rights reserved.</p>
        <p className="text-sm mt-1">A platform for fair and transparent dispute resolution.</p>
      </div>
    </footer>
  );
};

export default Footer;
