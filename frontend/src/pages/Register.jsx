import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser as apiRegisterUser } from '../api/authApi';
import { validateUserRegister, getApiErrorMessage } from '../utils/validation';
import Input from '../components/Input';
import Button from '../components/Button';
import { Car, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    const validation = validateUserRegister(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        fullname: {
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
        },
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const response = await apiRegisterUser(payload);
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid registration response from server');
      }

      loginUser(token, user);
      toast.success(`Account created! Welcome to RathoreTaxi, ${user.fullname?.firstname}!`);
      navigate('/home');
    } catch (error) {
      console.error('Registration error:', error);
      const message = getApiErrorMessage(error, 'Registration failed. Please check the details.');
      toast.error(message);
      setErrors({ form: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center mx-auto shadow-md font-bold mb-3">
            <Car className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign up in seconds to start requesting rides across the city
          </p>
        </div>

        {errors.form && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <span>⚠️</span>
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="e.g. Jatin"
              icon={User}
              error={errors.firstname}
              required
            />
            <Input
              label="Last Name"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="e.g. Rathore"
            />
          </div>

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
            placeholder="At least 6 characters"
            icon={Lock}
            error={errors.password}
            helperText="Minimum 6 characters"
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            icon={Lock}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
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
            Create Rider Account
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-gray-950 hover:underline">
              Sign in
            </Link>
          </p>

          <div className="pt-2">
            <Link
              to="/captain/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-full transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Looking to drive? Register as Captain →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
