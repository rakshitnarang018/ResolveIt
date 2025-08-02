import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/router';

/**
 * A layout component that wraps every page.
 * It now conditionally renders the Navbar and Footer.
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The page content to be rendered.
 */
const Layout = ({ children }) => {
  const router = useRouter();
  // An array of routes where the default Navbar and Footer should NOT be shown.
  const noNavAndFooter = ['/'];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Only render the Navbar if the current path is NOT in the noNavAndFooter array */}
      {!noNavAndFooter.includes(router.pathname) && <Navbar />}
      
      {/* The main content doesn't need a container here anymore since pages handle their own layout */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Only render the Footer if the current path is NOT in the noNavAndFooter array */}
      {!noNavAndFooter.includes(router.pathname) && <Footer />}
    </div>
  );
};

export default Layout;