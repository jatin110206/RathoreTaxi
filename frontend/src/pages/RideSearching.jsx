import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { 
  Car, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  KeyRound, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  Radio
} from 'lucide-react';
import Map from '../components/Map';
import CaptainCard from '../components/CaptainCard';
import Button from '../components/Button';
import { formatCurrency, getVehicleLabel } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function RideSearching() {
  const { 
    activeRide, 
    updateRideState, 
    cancelActiveRide, 
    completeActiveRide 
  } = useRide();

  const navigate = useNavigate();

  // Coordinates from the actual booked ride (e.g. Bhopal, Indore, Delhi, etc.)
  const pickupCoords = activeRide?.pickupCoords || [23.2599, 77.4126];
  const destCoords = activeRide?.destCoords || [pickupCoords[0] + 0.03, pickupCoords[1] + 0.03];

  const [captainCoords, setCaptainCoords] = useState([
    pickupCoords[0] - 0.008,
    pickupCoords[1] - 0.006,
  ]);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // If no active ride, redirect back to booking
  useEffect(() => {
    if (!activeRide) {
      navigate('/book', { replace: true });
    }
  }, [activeRide, navigate]);

  // Update initial captain position near the booked pickup
  useEffect(() => {
    if (activeRide?.pickupCoords) {
      setCaptainCoords([
        activeRide.pickupCoords[0] - 0.008,
        activeRide.pickupCoords[1] - 0.006,
      ]);
    }
  }, [activeRide?.pickupCoords]);

  // Simulate captain finding & trip progression
  useEffect(() => {
    if (!activeRide) return;

    let timer;

    if (activeRide.status === 'searching') {
      // Find a captain in 4 seconds
      timer = setTimeout(() => {
        const mockCaptain = {
          _id: 'capt_987654',
          fullname: {
            firstname: 'Rajesh',
            lastname: 'Rathore',
          },
          email: 'captain.rajesh@rathoretaxi.com',
          vehicle: {
            color: 'Silver',
            plate: 'MP 04 AB 4589',
            capacity: 4,
            vehicleType: activeRide.vehicleType || 'car',
          },
          rating: 4.9,
          phone: '+91 98765 43210',
        };

        updateRideState({
          status: 'accepted',
          captain: mockCaptain,
        });

        toast.success('Captain Rajesh has accepted your ride!');
      }, 4000);
    } else if (activeRide.status === 'accepted') {
      // Captain moving closer
      timer = setTimeout(() => {
        updateRideState({ status: 'arriving' });
        const pLat = activeRide.pickupCoords ? activeRide.pickupCoords[0] : 23.2599;
        const pLng = activeRide.pickupCoords ? activeRide.pickupCoords[1] : 77.4126;
        setCaptainCoords([pLat - 0.003, pLng - 0.002]);
      }, 4500);
    } else if (activeRide.status === 'arriving') {
      // Captain arrived at pickup
      timer = setTimeout(() => {
        updateRideState({ status: 'arrived' });
        if (activeRide.pickupCoords) {
          setCaptainCoords(activeRide.pickupCoords);
        }
        toast('Captain has arrived at your pickup spot!', { icon: '📍' });
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [activeRide?.status]);

  if (!activeRide) return null;

  const handleStartTripSimulation = () => {
    updateRideState({ status: 'started' });
    toast.success('Ride started! Have a safe journey.');
  };

  const handleCompleteTrip = () => {
    completeActiveRide();
    toast.success('Trip completed! Thank you for riding with RathoreTaxi.');
    navigate('/rides');
  };

  const handleConfirmCancel = () => {
    cancelActiveRide();
    setShowCancelModal(false);
    toast('Ride was cancelled.', { icon: '🛑' });
    navigate('/home');
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/home"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-950 bg-white px-3.5 py-2 rounded-full border border-gray-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
              Trip #{activeRide.id}
            </span>
          </div>
        </div>

        {/* ── Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Ride Status & Driver Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 1. Searching State */}
            {activeRide.status === 'searching' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 text-center space-y-6 shadow-sm">
                <div className="relative flex items-center justify-center py-6">
                  {/* Radar ping animation */}
                  <span className="animate-ping absolute inline-flex h-32 w-32 rounded-full bg-amber-400 opacity-25"></span>
                  <span className="animate-pulse absolute inline-flex h-24 w-24 rounded-full bg-amber-300 opacity-40"></span>
                  <div className="w-16 h-16 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center shadow-xl font-bold z-10">
                    <Car className="w-8 h-8 animate-bounce" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-gray-950">
                    Finding your captain...
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Connecting with high-rated RathoreTaxi drivers nearby in your zone
                  </p>
                </div>

                {/* Ride Summary Pill */}
                <div className="bg-gray-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-gray-200/80">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-500">Vehicle:</span>
                    <span className="font-bold text-gray-900">{getVehicleLabel(activeRide.vehicleType)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-500">Pickup:</span>
                    <span className="font-bold text-gray-900 line-clamp-1">{activeRide.pickup}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-500">Destination:</span>
                    <span className="font-bold text-gray-900 line-clamp-1">{activeRide.destination}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                    <span className="text-gray-500">Fare:</span>
                    <span className="font-black text-gray-950 text-sm">{formatCurrency(activeRide.fare)}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Search
                </Button>
              </div>
            )}

            {/* 2. Captain Assigned / Arriving / In Progress */}
            {activeRide.status !== 'searching' && (
              <div className="space-y-5">
                <CaptainCard
                  captain={activeRide.captain}
                  otp={activeRide.otp}
                  status={activeRide.status}
                  onCancel={() => setShowCancelModal(true)}
                />

                {/* Ride status simulation control buttons */}
                <div className="bg-white rounded-3xl p-5 border border-gray-200 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Trip Progress Simulation (Live Test Control)
                  </p>
                  
                  {activeRide.status === 'arrived' && (
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={handleStartTripSimulation}
                    >
                      Start Ride (Enter PIN)
                    </Button>
                  )}

                  {activeRide.status === 'started' && (
                    <Button
                      variant="dark"
                      size="md"
                      fullWidth
                      onClick={handleCompleteTrip}
                    >
                      Complete Ride & Pay {formatCurrency(activeRide.fare)}
                    </Button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Live Map View (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="text-xs font-bold text-gray-800">
                    Live GPS Telemetry
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {activeRide.status.toUpperCase()}
                </span>
              </div>

              <div className="h-[480px] lg:h-[560px] w-full">
                <Map
                  pickupCoords={pickupCoords}
                  destinationCoords={destCoords}
                  captainLocation={activeRide.status !== 'searching' ? captainCoords : null}
                  showRoute={true}
                  height="100%"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto font-bold">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-gray-950">Cancel this ride?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to cancel? No cancellation fees apply when cancelled promptly.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Ride
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleConfirmCancel}
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
