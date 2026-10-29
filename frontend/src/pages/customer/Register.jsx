import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });
        setLoading(false);

        if (result.success) {
            navigate('/', { replace: true });
        } else {
            setError(result.message || 'Registration failed.');
        }
    };

    return (
        <div style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Background Image with blur effect matching the original */}
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

            {/* Form Box Card */}
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
                    Sign Up
                </h3>

                <p style={{
                    textAlign: 'center',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    marginBottom: '26px'
                }}>
                    Sign up for a new account
                </p>

                {/* Error Banner */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        marginBottom: '20px',
                        borderRadius: '8px',
                        background: 'rgba(220, 53, 69, 0.25)',
                        border: '1px solid rgba(220, 53, 69, 0.4)',
                        color: '#FFFFFF',
                        fontSize: '13px'
                    }}>
                        <AlertCircle size={18} color="#FF6B6B" style={{ flexShrink: 0 }} />
                        <span><strong>Error:</strong> {error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        style={{
                            width: '100%',
                            height: '56px',
                            background: 'rgba(255, 255, 255, 0.07)',
                            border: '1px solid rgba(255, 255, 255, 0.16)',
                            color: '#FFFFFF',
                            fontSize: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            padding: '0 18px',
                            outline: 'none',
                            transition: 'border-color 0.2s, background 0.2s'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#FFFFFF';
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.07)';
                        }}
                        required
                    />

                    {/* Email Input */}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        style={{
                            width: '100%',
                            height: '56px',
                            background: 'rgba(255, 255, 255, 0.07)',
                            border: '1px solid rgba(255, 255, 255, 0.16)',
                            color: '#FFFFFF',
                            fontSize: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            padding: '0 18px',
                            outline: 'none',
                            transition: 'border-color 0.2s, background 0.2s'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#FFFFFF';
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.07)';
                        }}
                        required
                    />

                    {/* Password Input with eye toggle */}
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            style={{
                                width: '100%',
                                height: '56px',
                                background: 'rgba(255, 255, 255, 0.07)',
                                border: '1px solid rgba(255, 255, 255, 0.16)',
                                color: '#FFFFFF',
                                fontSize: '15px',
                                borderRadius: '8px',
                                padding: '0 48px 0 18px',
                                outline: 'none',
                                transition: 'border-color 0.2s, background 0.2s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#FFFFFF';
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                                e.target.style.background = 'rgba(255, 255, 255, 0.07)';
                            }}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255, 255, 255, 0.6)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Create Account Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            height: '56px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 600,
                            background: 'linear-gradient(to right, #111111, #333333)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            color: '#FFFFFF',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.currentTarget.style.background = '#000000';
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.currentTarget.style.background = 'linear-gradient(to right, #111111, #333333)';
                        }}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                {/* Footer text */}
                <div style={{
                    textAlign: 'center',
                    fontSize: '13px',
                    marginTop: '22px',
                    color: 'rgba(255, 255, 255, 0.9)'
                }}>
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            fontWeight: 600
                        }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
