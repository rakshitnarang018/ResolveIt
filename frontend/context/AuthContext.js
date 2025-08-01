import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

// Create the context
const AuthContext = createContext();

// API client setup
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for a token in cookies on initial load
        const token = Cookies.get('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                // Check if token is expired
                if (decodedUser.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decodedUser);
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout(); // Clear invalid token
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/users/login', { email, password });
            const decodedUser = jwtDecode(data.token);
            
            Cookies.set('token', data.token, { expires: 30, secure: process.env.NODE_ENV === 'production' });
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(decodedUser);
            
            toast.success('Logged in successfully!');
            
            // Redirect based on role
            if (decodedUser.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
            console.error("Login error:", error);
        }
    };

    const register = async (userData) => {
         try {
            const { data } = await api.post('/users/register', userData);
            const decodedUser = jwtDecode(data.token);

            Cookies.set('token', data.token, { expires: 30, secure: process.env.NODE_ENV === 'production' });
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(decodedUser);

            toast.success('Registration successful!');
            router.push('/dashboard');
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed.';
            toast.error(message);
            console.error("Registration error:", error);
        }
    };
    
    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        toast.success('You have been logged out.');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Export the api instance to be used in other parts of the application
export default api;