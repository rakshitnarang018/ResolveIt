import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import Layout from '@/components/Layout'


export default function App({ Component, pageProps }) {
  return (
    // AuthProvider makes authentication state available to all components
    <AuthProvider>
      {/* Layout provides a consistent structure (e.g., Navbar, Footer) */}
      <Layout>
        {/* Toaster is for displaying notifications */}
        <Toaster position="top-center" reverseOrder={false} />
        {/* The actual page component being rendered */}
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}
