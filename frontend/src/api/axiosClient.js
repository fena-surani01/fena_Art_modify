import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor: Automatically attach token if available
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('fenaria_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle expired tokens or unauthenticated errors
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If token invalid, clear local storage
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/staff/login') {
                localStorage.removeItem('fenaria_token');
                localStorage.removeItem('fenaria_user');
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
