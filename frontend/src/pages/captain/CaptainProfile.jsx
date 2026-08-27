import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCaptainProfile, logoutCaptain } from '../../api/captainApi';
import { 
  Shield, 
  Car, 
  Mail, 
  LogOut, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Palette, 
  Hash, 
  Users 
} from 'lucide-react';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

export default function CaptainProfile() {
  const { captain, setCaptain, clearSession } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await getCaptainProfile();
        if (data?.captain) {
          setCaptain(data.captain);
        }
      } catch (err) {
        console.warn('Failed to refresh captain profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [setCaptain]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutCaptain().catch(() => {});
      clearSession();
      toast.success('Captain duty signed out.');
      navigate('/captain/login');
    } catch (err) {
      clearSession();
      navigate('/captain/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const vehicle = captain?.vehicle;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-700 shadow-xl relative">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-amber-400 text-gray-950 font-black text-3xl flex items-center justify-center shadow-lg uppercase">
                {captain?.fullname?.firstname?.[0] || 'C'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950 px-3 py-0.5 rounded-full border border-amber-800">
                <Award className="w-3.5 h-3.5" /> Fleet Gold Partner
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Capt. {captain?.fullname?.firstname} {captain?.fullname?.lastname || ''}
              </h1>
              <p className="text-sm text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-gray-400" /> {captain?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Information Box */}
        <div className="bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-700 space-y-4">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-400" /> Vehicle Registration Details
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700">
              <p className="text-[10px] uppercase font-bold text-gray-400">License Plate</p>
              <p className="text-sm font-mono font-black text-amber-400 mt-1">{vehicle?.plate || 'DL 01 AB 1234'}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700">
              <p className="text-[10px] uppercase font-bold text-gray-400">Vehicle Type</p>
              <p className="text-sm font-bold text-white capitalize mt-1">{vehicle?.vehicleType || 'Car'}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700">
              <p className="text-[10px] uppercase font-bold text-gray-400">Body Color</p>
              <p className="text-sm font-bold text-white capitalize mt-1">{vehicle?.color || 'Silver'}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700">
              <p className="text-[10px] uppercase font-bold text-gray-400">Capacity</p>
              <p className="text-sm font-bold text-white mt-1">{vehicle?.capacity || 4} Passengers</p>
            </div>
          </div>
        </div>

        {/* Duty Logout */}
        <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white text-sm">Sign Out Captain Shift</h4>
            <p className="text-xs text-gray-400">You will be set offline and won't receive requests</p>
          </div>

          <Button
            variant="danger"
            size="md"
            isLoading={isLoggingOut}
            icon={LogOut}
            onClick={handleLogout}
          >
            Sign Out Shift
          </Button>
        </div>

      </div>
    </div>
  );
}
