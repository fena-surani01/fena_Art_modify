import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('fenaria_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('fenaria_token') || null);
    const [loading, setLoading] = useState(true);

    // Verify token on initial load
    useEffect(() => {
        const verifyAuth = async () => {
            const savedToken = localStorage.getItem('fenaria_token');
            if (savedToken) {
                try {
                    const response = await axiosClient.get('/auth/me');
                    if (response.data.success) {
                        setUser(response.data.user);
                        localStorage.setItem('fenaria_user', JSON.stringify(response.data.user));
                    }
                } catch (err) {
                    console.warn('Session expired or invalid token:', err.message);
                    logout();
                }
            }
            setLoading(false);
        };
        verifyAuth();
    }, []);

    // Customer Login
    const login = async (email, password) => {
        try {
            const response = await axiosClient.post('/auth/login', { email, password });
            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data;
                setToken(newToken);
                setUser(newUser);
                localStorage.setItem('fenaria_token', newToken);
                localStorage.setItem('fenaria_user', JSON.stringify(newUser));
                return { success: true, user: newUser };
            }
            return { success: false, message: response.data.message || 'Login failed' };
        } catch (error) {
            const msg = error.response?.data?.message || 'Invalid email or password';
            return { success: false, message: msg };
        }
    };

    // Customer Registration
    const register = async (userData) => {
        try {
            const response = await axiosClient.post('/auth/register', userData);
            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data;
                setToken(newToken);
                setUser(newUser);
                localStorage.setItem('fenaria_token', newToken);
                localStorage.setItem('fenaria_user', JSON.stringify(newUser));
                return { success: true, user: newUser };
            }
            return { success: false, message: response.data.message || 'Registration failed' };
        } catch (error) {
            const msg = error.response?.data?.message || 'Registration failed. Please check your details.';
            return { success: false, message: msg };
        }
    };

    // Logout
    const logout = async () => {
        try {
            if (token) {
                await axiosClient.post('/auth/logout');
            }
        } catch (err) {
            // Ignore error on logout
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('fenaria_token');
            localStorage.removeItem('fenaria_user');
        }
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        role: user?.role || 'guest',
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
