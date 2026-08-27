import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRide, VEHICLE_TYPES } from '../context/RideContext';
import { 
  Car, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Compass, 
  Shield, 
  Sparkles, 
  Radio, 
  Zap, 
  Bike,
  Locate,
  Loader2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { reverseGeocode } from '../utils/geocoding';
import LocationInput from '../components/LocationInput';
import Button from '../components/Button';
import RideCard from '../components/RideCard';
import toast from 'react-hot-toast';

export default function Home() {
  const { user } = useAuth();
  const { 
    pickup, 
    setPickup, 
    pickupCoords,
    setPickupCoords,
    destination, 
    setDestination, 
    destCoords,
    setDestCoords,
    selectedVehicle, 
    setSelectedVehicle, 
    distanceKm,
    getFares, 
    activeRide,
    recentRides,
    isAutoLocating
  } = useRide();

  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);

  const fares = getFares(distanceKm || 4.5);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPickupCoords(coords);
        const resolved = await reverseGeocode(coords[0], coords[1]);
        setPickup(resolved);
        setIsLocating(false);
        toast.success('Pickup updated to current GPS address');
      },
      (err) => {
        setIsLocating(false);
        toast.error('Unable to fetch GPS location: ' + err.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleStartBooking = (e) => {
    e.preventDefault();
    if (!pickup?.trim()) {
      toast.error('Please enter a pickup location');
      return;
    }
    if (!destination?.trim()) {
      toast.error('Please enter a destination');
      return;
    }
    navigate('/book');
  };

  const userName = user?.fullname?.firstname || 'Rider';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ── Active Ride Notification Banner ── */}
        {activeRide && activeRide.status !== 'completed' && activeRide.status !== 'cancelled' && (
          <div className="bg-amber-400 text-gray-950 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 text-amber-400 flex items-center justify-center font-bold">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider bg-gray-900 text-white px-2.5 py-0.5 rounded-full">
                  Trip In Progress
                </span>
                <h3 className="text-lg font-black text-gray-950 mt-1">
                  Ride to {activeRide.destination}
                </h3>
                <p className="text-xs font-semibold text-gray-800">
                  Fare: {formatCurrency(activeRide.fare)} • Status: {activeRide.status.toUpperCase()}
                </p>
              </div>
            </div>

            <Link
              to="/ride/searching"
              className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-full font-black text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              Track Live Ride <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ── User Header & Greeting ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-600 bg-amber-100 px-3 py-0.5 rounded-full">
                RathoreTaxi Member
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Good day, {userName}! 🚕
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Where would you like to travel today in the city?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-400 text-gray-950 font-black rounded-full text-sm hover:bg-amber-500 shadow-md hover:shadow-lg transition"
            >
              <Car className="w-5 h-5" />
              Book New Ride
            </Link>
            <Link
              to="/profile"
              className="p-3.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full transition"
              title="View Profile"
            >
              <Compass className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* ── Main Dashboard Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Quick Booker (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-950">Book a Fast Ride</h2>
                  <p className="text-xs text-gray-500">Pickups usually take under 2 minutes</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5" /> High Captain Availability
                </span>
              </div>

              <form onSubmit={handleStartBooking} className="space-y-4">
                <LocationInput
                  label="Pickup Location"
                  value={pickup}
                  onChange={(val) => setPickup(val)}
                  onSelectLocation={(item) => {
                    setPickup(item.name);
                    setPickupCoords(item.coords);
                  }}
                  placeholder="Enter pickup point (e.g. Metro Station)"
                  iconColor="text-emerald-600"
                  required
                  autoDetectBtn={
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      disabled={isLocating || isAutoLocating}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                    >
                      {isLocating || isAutoLocating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Locate className="w-3.5 h-3.5" />
                      )}
                      <span>{isLocating || isAutoLocating ? 'Detecting GPS...' : 'Use My GPS'}</span>
                    </button>
                  }
                />

                <LocationInput
                  label="Destination Spot"
                  value={destination}
                  onChange={(val) => setDestination(val)}
                  onSelectLocation={(item) => {
                    setDestination(item.name);
                    setDestCoords(item.coords);
                  }}
                  placeholder="Where do you want to go?"
                  iconColor="text-rose-600"
                  required
                />

                {/* Ride category selectors */}
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase text-gray-700 mb-2">Select Ride Type</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedVehicle('car')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition ${
                        selectedVehicle === 'car'
                          ? 'border-amber-400 bg-amber-50 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Car className="w-6 h-6 text-gray-900 mb-1.5" />
                      <p className="text-xs font-extrabold text-gray-900">Prime Car</p>
                      <p className="text-xs font-black text-amber-800 mt-0.5">{formatCurrency(fares.car)}</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedVehicle('auto')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition ${
                        selectedVehicle === 'auto'
                          ? 'border-amber-400 bg-amber-50 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Zap className="w-6 h-6 text-gray-900 mb-1.5" />
                      <p className="text-xs font-extrabold text-gray-900">Auto</p>
                      <p className="text-xs font-black text-amber-800 mt-0.5">{formatCurrency(fares.auto)}</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedVehicle('bike')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition ${
                        selectedVehicle === 'bike'
                          ? 'border-amber-400 bg-amber-50 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Bike className="w-6 h-6 text-gray-900 mb-1.5" />
                      <p className="text-xs font-extrabold text-gray-900">Moto Bike</p>
                      <p className="text-xs font-black text-amber-800 mt-0.5">{formatCurrency(fares.bike)}</p>
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="mt-4"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Configure & Book Ride
                </Button>
              </form>
            </div>

            {/* Quick Safety Card */}
            <div className="bg-gray-950 text-white rounded-3xl p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  Rider Protection Program
                </span>
                <h4 className="text-base font-bold text-white">Always verify your 4-digit PIN</h4>
                <p className="text-xs text-gray-400">Never board a vehicle with a non-matching number plate.</p>
              </div>
              <Shield className="w-10 h-10 text-amber-400 shrink-0 ml-4" />
            </div>
          </div>

          {/* Right Column: Recent Trips & Stats (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <h3 className="font-extrabold text-gray-950 text-lg">Recent Rides</h3>
                </div>
                <Link to="/rides" className="text-xs font-bold text-amber-700 hover:underline">
                  View All →
                </Link>
              </div>

              {recentRides.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Car className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">No rides booked yet</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Your completed and past rides will appear here.
                  </p>
                  <Link
                    to="/book"
                    className="inline-block mt-4 px-4 py-2 bg-amber-400 text-gray-950 font-bold text-xs rounded-full hover:bg-amber-500 transition"
                  >
                    Take Your First Trip
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRides.slice(0, 3).map((ride, idx) => (
                    <RideCard key={ride.id || idx} ride={ride} />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
