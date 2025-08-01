import Navbar from './Navbar';
import Footer from './Footer';

/**
 * A layout component that wraps every page.
 * It includes the main navigation bar, a main content area, and a footer.
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The page content to be rendered.
 */
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
