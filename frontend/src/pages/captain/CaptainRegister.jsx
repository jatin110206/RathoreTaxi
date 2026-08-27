import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerCaptain as apiRegisterCaptain } from '../../api/captainApi';
import { validateCaptainRegister, getApiErrorMessage } from '../../utils/validation';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Shield, Mail, Lock, User, Car, Palette, Hash, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CaptainRegister() {
  const { loginCaptain } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    color: '',
    plate: '',
    capacity: 4,
    vehicleType: 'car',
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

    const validation = validateCaptainRegister(formData);
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
        vehicle: {
          color: formData.color.trim(),
          plate: formData.plate.trim().toUpperCase(),
          capacity: Number(formData.capacity),
          vehicleType: formData.vehicleType,
        },
      };

      const response = await apiRegisterCaptain(payload);
      const { token, captain } = response.data;

      if (!token || !captain) {
        throw new Error('Invalid captain registration response from server');
      }

      loginCaptain(token, captain);
      toast.success(`Captain account registered! Welcome to the RathoreTaxi fleet.`);
      navigate('/captain/dashboard');
    } catch (error) {
      console.error('Captain registration error:', error);
      const message = getApiErrorMessage(error, 'Captain registration failed. Please review inputs.');
      toast.error(message);
      setErrors({ form: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-900">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center mx-auto shadow-md font-bold mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Drive with RathoreTaxi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight mt-2">
            Captain Registration
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Register your vehicle, start accepting rides, and earn daily payouts
          </p>
        </div>

        {errors.form && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <span>⚠️</span>
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Captain Personal Info */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="e.g. Rajesh"
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
            label="Captain Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="captain@example.com"
            icon={Mail}
            error={errors.email}
            required
            autoComplete="email"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              icon={Lock}
              error={errors.password}
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
              placeholder="Confirm password"
              icon={Lock}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Vehicle Information Section */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-black uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
              <Car className="w-4 h-4" /> Vehicle Specifications
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['car', 'auto', 'bike'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, vehicleType: type }))}
                      className={`p-2.5 rounded-xl border-2 font-bold text-xs capitalize flex items-center justify-center gap-1.5 transition ${
                        formData.vehicleType === type
                          ? 'border-amber-400 bg-amber-50 text-gray-950 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Plate Number"
                  id="plate"
                  name="plate"
                  value={formData.plate}
                  onChange={handleChange}
                  placeholder="e.g. DL 01 AB 1234"
                  icon={Hash}
                  error={errors.plate}
                  required
                />
                <Input
                  label="Vehicle Color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g. Silver / White"
                  icon={Palette}
                  error={errors.color}
                  required
                />
              </div>

              <Input
                label="Seating Capacity (Passengers)"
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                max="8"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="4"
                icon={Users}
                error={errors.capacity}
                required
              />
            </div>
          </div>

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
            Complete Fleet Onboarding
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Already registered as Captain?{' '}
            <Link to="/captain/login" className="font-bold text-gray-950 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
