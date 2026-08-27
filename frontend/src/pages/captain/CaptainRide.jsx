import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Car, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Navigation, 
  KeyRound, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import Map from '../../components/Map';
import Button from '../../components/Button';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function CaptainRide() {
  const location = useLocation();
  const navigate = useNavigate();
  const { captain } = useAuth();

  const initialRide = location.state?.ride || {
    id: 'REQ-4589',
    userName: 'Aman Sharma',
    pickup: 'Barakhamba Road, Connaught Place',
    destination: 'DLF CyberCity, Phase 2, Gurugram',
    distanceKm: 18.5,
    fare: 340,
    vehicleType: captain?.vehicle?.vehicleType || 'car',
  };

  const [rideState, setRideState] = useState('accepted'); // 'accepted' | 'arriving' | 'arrived' | 'started' | 'completed'
  const [pinInput, setPinInput] = useState('');
  const [isPinValid, setIsPinValid] = useState(true);

  const handleNextStep = () => {
    if (rideState === 'accepted') {
      setRideState('arriving');
      toast.success('Status updated: Heading to passenger pickup spot.');
    } else if (rideState === 'arriving') {
      setRideState('arrived');
      toast.success('Status updated: Arrived at pickup spot.');
    } else if (rideState === 'arrived') {
      if (!pinInput || pinInput.length < 4) {
        setIsPinValid(false);
        toast.error('Please ask the passenger for their 4-digit ride PIN');
        return;
      }
      setRideState('started');
      toast.success('Ride PIN verified! Trip started.');
    } else if (rideState === 'started') {
      setRideState('completed');
      toast.success(`Trip completed! Collect ${formatCurrency(initialRide.fare)} cash/UPI from passenger.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-800 rounded-3xl p-5 border border-gray-700">
          <div className="flex items-center gap-3">
            <Link
              to="/captain/dashboard"
              className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-xs font-black uppercase text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full">
                Active Passenger Trip
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Trip #{initialRide.id}
              </h2>
            </div>
          </div>

          <span className="font-mono text-sm font-black bg-amber-400 text-gray-950 px-4 py-1.5 rounded-full uppercase">
            {rideState}
          </span>
        </div>

        {/* ── Split Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Passenger & Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Passenger Information Card */}
            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-gray-950 font-black text-lg flex items-center justify-center">
                    {initialRide.userName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{initialRide.userName}</h4>
                    <p className="text-xs text-gray-400">RathoreTaxi Verified Passenger</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Calling Passenger... (Feature preview)')}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition shadow-md"
                  title="Call Passenger"
                >
                  <Phone className="w-5 h-5" />
                </button>
              </div>

              {/* Route Path */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Pickup</p>
                    <p className="font-bold text-gray-100">{initialRide.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Destination</p>
                    <p className="font-bold text-gray-100">{initialRide.destination}</p>
                  </div>
                </div>
              </div>

              {/* Fare Banner */}
              <div className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between border border-gray-700">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Cash / UPI to Collect</p>
                  <p className="text-2xl font-black text-amber-400">{formatCurrency(initialRide.fare)}</p>
                </div>
                <span className="text-xs text-gray-400 font-semibold">{initialRide.distanceKm} KM</span>
              </div>

              {/* Step: Arrived at Pickup → Ask PIN */}
              {rideState === 'arrived' && (
                <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 space-y-3">
                  <input
                    type="text"
                    maxLength="4"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setIsPinValid(true);
                    }}
                    placeholder="Enter 4-digit OTP"
                    className="w-full text-center tracking-widest font-mono text-2xl font-black bg-gray-900 border border-gray-700 rounded-xl p-3 text-amber-400 focus:outline-hidden focus:border-amber-400"
                  />
                  <div className="flex justify-between items-center text-[11px] text-gray-400">
                    <span>Passenger shares this upon boarding</span>
                    <span className="text-amber-400 font-mono font-bold">(Test PIN: any 4 digits, e.g. 1234)</span>
                  </div>
                  {!isPinValid && (
                    <p className="text-xs text-rose-400 font-bold">Please enter the 4-digit OTP PIN</p>
                  )}
                </div>
              )}

              {/* Action Buttons based on progression */}
              {rideState !== 'completed' ? (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleNextStep}
                >
                  {rideState === 'accepted' && 'Mark as Arriving'}
                  {rideState === 'arriving' && 'Arrived at Pickup'}
                  {rideState === 'arrived' && 'Verify PIN & Start Trip'}
                  {rideState === 'started' && 'Complete Trip & Collect Fare'}
                </Button>
              ) : (
                <div className="space-y-3 text-center">
                  <div className="p-4 bg-emerald-950/60 border border-emerald-700 rounded-2xl text-emerald-300 text-sm font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Trip Successfully Completed!
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => navigate('/captain/dashboard')}
                  >
                    Back to Duty Dashboard
                  </Button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Navigation Map (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-gray-800 rounded-3xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-gray-200">GPS Navigation Track</span>
                </div>
                <a
                  href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(
                    '28.6315,77.2167;' + (rideState === 'started' ? '28.5244,77.2167' : '28.6315,77.2167')
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                >
                  Open in OpenStreetMap ↗
                </a>
              </div>

              <div className="h-[480px] w-full">
                <Map
                  pickupCoords={[28.6315, 77.2167]}
                  destinationCoords={[28.5244, 77.2167]}
                  captainLocation={[28.6280, 77.2140]}
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
