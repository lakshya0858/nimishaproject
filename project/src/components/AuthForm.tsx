import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  mode?: 'login' | 'register';
  onSuccess: () => void;
}

function AuthForm({ mode = 'login', onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, register } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const success = login(formData.email, formData.password);
        if (success) {
          onSuccess();
        } else {
          setErrors({ submit: 'Invalid email or password' });
        }
      } else {
        const success = register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
        if (success) {
          onSuccess();
        } else {
          setErrors({ submit: 'Email already exists' });
        }
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="opacity-90">
            {isLogin ? 'Sign in to your account' : 'Join our healthcare community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <InputField
              icon={User}
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              error={errors.name}
            />
          )}

          <InputField
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            error={errors.email}
          />

          {!isLogin && (
            <InputField
              icon={Phone}
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              error={errors.phone}
            />
          )}

          <div className="relative">
            <InputField
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              error={errors.password}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {!isLogin && (
            <InputField
              icon={Lock}
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              error={errors.confirmPassword}
            />
          )}

          {errors.submit && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm animate-shake">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Demo Accounts */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">Demo Accounts:</h3>
        <div className="text-sm space-y-1">
          <p><strong>Admin:</strong> admin@demo.com / password123</p>
          <p><strong>User:</strong> user@demo.com / password123</p>
        </div>
      </div>
    </div>
  );
}

function InputField({ 
  icon: Icon, 
  type, 
  placeholder, 
  value, 
  onChange, 
  error 
}: {
  icon: any;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="relative">
        <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-red-600 text-sm animate-fade-in">{error}</p>
      )}
    </div>
  );
}

export default AuthForm;