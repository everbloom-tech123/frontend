import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import * as authService from '../services/AuthService';

const InputField = ({ label, type, name, value, onChange, error, icon: Icon }) => (
  <div className="mb-3 sm:mb-4 relative">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
      </div>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`block w-full pl-8 sm:pl-10 pr-3 py-2 border-2 border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm ${
          error ? 'border-red-500' : ''
        }`}
        placeholder={label}
      />
    </div>
    {error && <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>}
  </div>
);

const PasswordInput = ({ label, name, value, onChange, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-3 sm:mb-4 relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={`block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 border-2 border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm ${
            error ? 'border-red-500' : ''
          }`}
          placeholder={label}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 
            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" /> : 
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
          }
        </button>
      </div>
      {error && <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>}
    </div>
  );
};

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleBasedRedirect = (role) => {
    setApiError('');
    const from = location.state?.from || '/';

    switch (role) {
      case 'ROLE_ADMIN':
        navigate('/admin/manage-experiences');
        break;
      case 'ROLE_CUSTOMER':
        navigate(from);
        break;
      default:
        navigate('/');
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setApiError('');
      try {
        const response = await authService.login(formData.email, formData.password);
        if (response && response.role) {
          handleRoleBasedRedirect(response.role);
        }
      } catch (error) {
        console.error('Login error:', error);
        setApiError(error.message || 'An error occurred during login');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8 bg-white p-6 sm:p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <InputField
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
          />
          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          {apiError && (
            <div className="rounded-md bg-red-50 p-3 sm:p-4">
              <div className="flex">
                <div className="ml-2 sm:ml-3">
                  <h3 className="text-xs sm:text-sm font-medium text-red-800">{apiError}</h3>
                </div>
              </div>
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-center space-y-2">
          <Link to="/signup" className="block text-sm sm:text-base font-medium text-red-600 hover:text-red-500">
            Don't have an account? Sign up
          </Link>
          <Link to="/forgot-password" className="block text-xs sm:text-sm font-medium text-red-600 hover:text-red-500">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;