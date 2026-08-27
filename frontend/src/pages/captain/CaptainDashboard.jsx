import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCaptainProfile } from '../../api/captainApi';
import { 
  Shield, 
  Car, 
  Power, 
  MapPin, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  X, 
  Phone, 
  User, 
  Award,
  Navigation,
  Sparkles
} from 'lucide-react';
import Map from '../../components/Map';
import Button from '../../components/Button';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function CaptainDashboard() {
  const { captain, setCaptain } = useAuth();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(true);
  const [activeRequest, setActiveRequest] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const [earnings, setEarnings] = useState({
    today: 2480,
    tripsToday: 8,
    hoursOnline: '6.5',
    rating: 4.9,
  });

  // Incoming mock ride request simulation
  useEffect(() => {
    if (!isOnline) {
      setActiveRequest(null);
      return;
    }

    // Simulate an incoming ride after 3 seconds when online
    const timer = setTimeout(() => {
      setActiveRequest({
        id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
        userName: 'Aman Sharma',
        pickup: 'Barakhamba Road, Connaught Place',
        destination: 'DLF CyberCity, Phase 2, Gurugram',
        distanceKm: 18.5,
        fare: 340,
        vehicleType: captain?.vehicle?.vehicleType || 'car',
        coords: [28.6315, 77.2167],
      });
      setCountdown(15);
      toast('🔔 New Ride Request Nearby!', { icon: '🚕' });
    }, 3500);

    return () => clearTimeout(timer);
  }, [isOnline]);

  // Countdown timer for incoming request
  useEffect(() => {
    if (!activeRequest) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveRequest(null);
          toast('Ride request expired.', { icon: '⌛' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRequest]);

  const handleAcceptRequest = () => {
    toast.success('Ride request accepted! Route assigned.');
    navigate('/captain/rides', { state: { ride: activeRequest } });
  };

  const handleDeclineRequest = () => {
    setActiveRequest(null);
    toast('Request declined. Waiting for next ride.', { icon: '🛑' });
  };

  const captainName = captain?.fullname?.firstname || 'Partner';
  const vehicle = captain?.vehicle;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ── Top Captain Header & Online Toggle ── */}
        <div className="bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-gray-950 font-black text-2xl flex items-center justify-center shadow-lg">
              {captainName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-0.5 rounded-full">
                  Captain Duty
                </span>
                <span className="text-xs font-mono bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                  {vehicle?.plate || 'DL 01 AB 1234'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Capt. {captainName} {captain?.fullname?.lastname || ''}
              </h1>
              <p className="text-xs text-gray-400">
                {vehicle?.color} {vehicle?.vehicleType?.toUpperCase()} • Fleet ID #RT-CAP-89
              </p>
            </div>
          </div>

          {/* Online/Offline Toggle Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsOnline(!isOnline);
                toast.success(isOnline ? 'You are now OFFLINE' : 'You are now ONLINE & ready for rides');
              }}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-full font-black text-sm transition-all duration-200 shadow-lg ${
                isOnline
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-600/20'
              }`}
            >
              <Power className="w-5 h-5" />
              <span>{isOnline ? 'ONLINE: AVAILABLE' : 'OFFLINE: PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* ── Captain Metrics / Daily Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase mb-2">
              <span>Today's Earnings</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{formatCurrency(earnings.today)}</p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">Payout ready tonight</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase mb-2">
              <span>Completed Trips</span>
              <Car className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{earnings.tripsToday}</p>
            <p className="text-[11px] text-gray-400 font-semibold mt-1">Target: 12 trips</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase mb-2">
              <span>Hours on Duty</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{earnings.hoursOnline}h</p>
            <p className="text-[11px] text-gray-400 font-semibold mt-1">Active GPS track</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase mb-2">
              <span>Captain Rating</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">⭐ {earnings.rating}</p>
            <p className="text-[11px] text-amber-400 font-semibold mt-1">Top 5% Partner Fleet</p>
          </div>
        </div>

        {/* ── Main Split View: Incoming Request / Map ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Request Card or Standby Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* When a request is active */}
            {activeRequest && isOnline && (
              <div className="bg-white text-gray-900 rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-amber-400 space-y-5 animate-in zoom-in-95 duration-200">
                {/* Header & Countdown Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-red-600">
                      Incoming Trip Request
                    </span>
                  </div>
                  <span className="font-mono text-sm font-black bg-amber-400 text-gray-950 px-3 py-1 rounded-full">
                    ⏱ {countdown}s
                  </span>
                </div>

                {/* Fare & Passenger */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Estimated Fare</p>
                    <p className="text-3xl font-black text-gray-950">{formatCurrency(activeRequest.fare)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase">Passenger</p>
                    <p className="text-base font-bold text-gray-900">{activeRequest.userName}</p>
                    <span className="text-xs text-gray-500">{activeRequest.distanceKm} KM Trip</span>
                  </div>
                </div>

                {/* Route detail */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-xs border border-gray-200">
                  <div className="flex items-start gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Pickup</p>
                      <p className="font-bold text-gray-900 line-clamp-1">{activeRequest.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Drop Location</p>
                      <p className="font-bold text-gray-900 line-clamp-1">{activeRequest.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Accept / Decline CTA */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleDeclineRequest}
                    className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl text-sm transition"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptRequest}
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-gray-950 font-black rounded-2xl text-sm shadow-md transition"
                  >
                    Accept Trip
                  </button>
                </div>
              </div>
            )}

            {/* Standby State */}
            {(!activeRequest || !isOnline) && (
              <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-700 text-amber-400 flex items-center justify-center mx-auto">
                  <Navigation className={`w-8 h-8 ${isOnline ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isOnline ? 'Searching for Passenger Trips...' : 'You are currently Offline'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    {isOnline
                      ? 'Stay on this screen. When a passenger books in your zone, the alert will pop up instantly.'
                      : 'Toggle your status to ONLINE above to start receiving ride requests.'}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Captain Guide Card */}
            <div className="bg-gray-800/60 rounded-2xl p-4 border border-gray-700 text-xs text-gray-300 space-y-2">
              <p className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Captain Pro Tip
              </p>
              <p>Always verify the passenger's 4-digit PIN before pressing "Start Ride" in your panel.</p>
            </div>
          </div>

          {/* Right Column: Live Map (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-gray-800 rounded-3xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-gray-200">Captain Live Hotspot Radar</span>
                </div>
                <span className="text-xs text-emerald-400 font-bold">GPS ACTIVE</span>
              </div>

              <div className="h-[480px] w-full">
                <Map
                  pickupCoords={[28.6315, 77.2167]}
                  destinationCoords={[28.5244, 77.2167]}
                  captainLocation={[28.6315, 77.2167]}
                  showRoute={true}
                  height="100%"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
