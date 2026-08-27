import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser as apiLoginUser } from '../api/authApi';
import { validateUserLogin, getApiErrorMessage } from '../utils/validation';
import Input from '../components/Input';
import Button from '../components/Button';
import { Car, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateUserLogin(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiLoginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid authentication response from server');
      }

      loginUser(token, user);
      toast.success(`Welcome back, ${user.fullname?.firstname || 'Rider'}!`);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      const message = getApiErrorMessage(error, 'Invalid email or password. Please try again.');
      toast.error(message);
      setErrors({ form: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 relative">
        {/* Brand Icon Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center mx-auto shadow-md font-bold mb-3">
            <Car className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to continue booking your rides with RathoreTaxi
          </p>
        </div>

        {/* Global Error Banner */}
        {errors.form && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <span>⚠️</span>
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={Mail}
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={Lock}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-6"
            icon={ArrowRight}
            iconPosition="right"
          >
            Sign In to Ride
          </Button>
        </form>

        {/* Alternate Navigation links */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-gray-950 hover:underline">
              Create an account
            </Link>
          </p>

          <div className="pt-2">
            <Link
              to="/captain/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-full transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Captain / Driver Login Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
