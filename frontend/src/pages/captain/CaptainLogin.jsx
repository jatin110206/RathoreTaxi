import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginCaptain as apiLoginCaptain } from '../../api/captainApi';
import { validateUserLogin, getApiErrorMessage } from '../../utils/validation';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Shield, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CaptainLogin() {
  const { loginCaptain } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/captain/dashboard';

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
      const response = await apiLoginCaptain({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, captain } = response.data;

      if (!token || !captain) {
        throw new Error('Invalid authentication response from server');
      }

      loginCaptain(token, captain);
      toast.success(`Welcome Captain ${captain.fullname?.firstname}! You are ready for duty.`);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Captain login error:', error);
      const message = getApiErrorMessage(error, 'Invalid captain credentials. Please try again.');
      toast.error(message);
      setErrors({ form: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-900">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        {/* Brand Icon Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center mx-auto shadow-md font-bold mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Captain Partner Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight mt-2">
            Captain Sign In
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Access your duty dashboard, accept ride requests, and track earnings
          </p>
        </div>

        {errors.form && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <span>⚠️</span>
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Captain Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="captain@rathoretaxi.com"
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
            placeholder="Enter your driver password"
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
            Start Captain Duty
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Want to drive with us?{' '}
            <Link to="/captain/register" className="font-bold text-amber-700 hover:underline">
              Register as Captain
            </Link>
          </p>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3.5 py-1.5 rounded-full transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Switch to Passenger Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
