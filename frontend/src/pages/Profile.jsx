import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRide } from '../context/RideContext';
import { getUserProfile, logoutUser } from '../api/authApi';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  LogOut, 
  MapPin, 
  Award,
  Sparkles
} from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser, clearSession } = useAuth();
  const { recentRides } = useRide();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await getUserProfile();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.warn('Failed to refresh profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser().catch(() => {});
      clearSession();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (err) {
      clearSession();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const completedTripsCount = recentRides.filter((r) => r.status === 'completed').length;
  const totalSpent = recentRides
    .filter((r) => r.status === 'completed')
    .reduce((acc, r) => acc + (r.fare || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gray-900 text-amber-400 font-black text-3xl flex items-center justify-center shadow-lg uppercase">
                {user?.fullname?.firstname?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" /> Verified RathoreTaxi Rider
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950">
                {user?.fullname?.firstname} {user?.fullname?.lastname || ''}
              </h1>
              <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Mail className="w-4 h-4 text-gray-400" /> {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Lifetime Ride Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs text-center">
            <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-950">{recentRides.length}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Total Bookings</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs text-center">
            <Award className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-950">{completedTripsCount}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Trips Finished</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs text-center">
            <CreditCard className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-950">₹{totalSpent}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Total Commute</p>
          </div>
        </div>

        {/* Account Details Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-gray-950 text-base">Account Information</h3>
          
          <div className="divide-y divide-gray-100 text-sm">
            <div className="py-3 flex justify-between">
              <span className="text-gray-500 font-medium">First Name:</span>
              <span className="font-bold text-gray-900">{user?.fullname?.firstname || 'N/A'}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-gray-500 font-medium">Last Name:</span>
              <span className="font-bold text-gray-900">{user?.fullname?.lastname || 'N/A'}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-gray-500 font-medium">Registered Email:</span>
              <span className="font-bold text-gray-900">{user?.email || 'N/A'}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-gray-500 font-medium">Account Status:</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Sign out of RathoreTaxi</h4>
            <p className="text-xs text-gray-500">You will need to sign in again to book rides</p>
          </div>

          <Button
            variant="danger"
            size="md"
            isLoading={isLoggingOut}
            icon={LogOut}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>

      </div>
    </div>
  );
}
