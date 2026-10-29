import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import { LogOut } from 'lucide-react';

// Customer Home / Dashboard Component matching Login & Register styling
const CustomerHome = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <div style={{
            position: 'relative',
            width: '100vw',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Background Image with blur effect matching Login/Register */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: "url('/images/auth.png')",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                filter: 'blur(3px)',
                transform: 'scale(1.05)',
                zIndex: 1
            }} />

            {/* Dark tint overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.52)',
                zIndex: 2
            }} />

            {/* Content Box Card */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '480px',
                maxWidth: '92%',
                padding: '48px 46px',
                borderRadius: '14px',
                background: 'rgba(0, 0, 0, 0.78)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.75)',
                color: '#FFFFFF',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <h3 style={{
                    textAlign: 'center',
                    marginBottom: '8px',
                    fontWeight: 600,
                    fontSize: '25px',
                    letterSpacing: '-0.3px',
                    color: '#FFFFFF'
                }}>
                    Fenaria Art Studio
                </h3>

                <p style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    marginBottom: '28px'
                }}>
                    {isAuthenticated ? 'Signed in to your account' : 'Sign in or sign up to continue'}
                </p>

                {isAuthenticated ? (
                    <>
                        {/* Logged in User Profile Info Card */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.07)',
                            border: '1px solid rgba(255, 255, 255, 0.16)',
                            borderRadius: '8px',
                            padding: '18px 20px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px'
                        }}>
                            <div style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FF6B6B 0%, #E76F51 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '18px',
                                color: '#FFFFFF',
                                flexShrink: 0,
                                boxShadow: '0 4px 12px rgba(231, 111, 81, 0.35)'
                            }}>
                                {user?.name ? user.name[0].toUpperCase() : 'U'}
                            </div>

                            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                <div style={{
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    marginBottom: '3px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {user?.name}
                                </div>
                                <div style={{
                                    fontSize: '13px',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {user?.email}
                                    </span>
                                    <span>•</span>
                                    <span style={{
                                        color: '#2A9D8F',
                                        fontWeight: 600,
                                        textTransform: 'capitalize'
                                    }}>
                                        {user?.role || 'Customer'}
                                    </span>
                                </div>
                                {user?.city && (
                                    <div style={{
                                        fontSize: '12px',
                                        color: 'rgba(255, 255, 255, 0.55)',
                                        marginTop: '4px'
                                    }}>
                                        📍 {user.city}{user.state ? `, ${user.state}` : ''}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sign Out Button */}
                        <button
                            onClick={logout}
                            style={{
                                width: '100%',
                                height: '56px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 600,
                                background: 'linear-gradient(to right, #111111, #333333)',
                                border: '1px solid rgba(255, 255, 255, 0.18)',
                                color: '#FFFFFF',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000000';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(to right, #111111, #333333)';
                            }}
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </>
                ) : (
                    /* Proper Sign In & Sign Up Buttons */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                        <Link
                            to="/login"
                            style={{
                                width: '100%',
                                height: '56px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 600,
                                background: 'linear-gradient(to right, #111111, #333333)',
                                border: '1px solid rgba(255, 255, 255, 0.22)',
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                                transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000000';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(to right, #111111, #333333)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                            }}
                        >
                            Sign In
                        </Link>

                        <Link
                            to="/register"
                            style={{
                                width: '100%',
                                height: '56px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 600,
                                background: 'linear-gradient(to right, #1a1a1a, #2e2e2e)',
                                border: '1px solid rgba(255, 255, 255, 0.22)',
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                                transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000000';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(to right, #1a1a1a, #2e2e2e)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                            }}
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Customer Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<CustomerHome />} />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
