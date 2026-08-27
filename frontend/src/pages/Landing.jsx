import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRide, VEHICLE_TYPES } from '../context/RideContext';
import { 
  Car, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  PhoneCall, 
  ChevronRight, 
  Award,
  Sparkles,
  Users,
  Locate,
  Loader2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { reverseGeocode } from '../utils/geocoding';
import LocationInput from '../components/LocationInput';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function Landing() {
  const { isAuthenticated, isCaptainAuthenticated } = useAuth();
  const { 
    pickup, 
    setPickup, 
    pickupCoords,
    setPickupCoords,
    destination, 
    setDestination, 
    destCoords,
    setDestCoords,
    distanceKm,
    getFares,
    isAutoLocating
  } = useRide();
  const navigate = useNavigate();

  const [isLocating, setIsLocating] = useState(false);

  const fares = getFares(distanceKm || 5.2);

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

  const handleHeroBook = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/book');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 bg-radial from-amber-500/10 via-slate-50 to-slate-50">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-12 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-900 border border-amber-300/70 text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>India's Most Reliable Urban Taxi Service</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.1]">
                Your ride, <span className="text-amber-500 underline decoration-amber-300 decoration-wavy decoration-2">your way.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Experience seamless, pocket-friendly, and verified rides with <strong className="text-gray-900">RathoreTaxi</strong>. Whether it's daily office commutes, late-night pickups, or instant moto sprints.
              </p>

              {/* Quick Hero Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={isAuthenticated ? '/book' : '/login'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-amber-400 text-gray-950 rounded-full font-black text-base hover:bg-amber-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <Car className="w-5 h-5" />
                  Book a Ride Now
                </Link>
                <Link
                  to={isCaptainAuthenticated ? '/captain/dashboard' : '/captain/register'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-base hover:bg-gray-800 shadow-md hover:shadow-lg transition-all"
                >
                  <Users className="w-5 h-5 text-amber-400" />
                  Drive with RathoreTaxi
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/80 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-black text-gray-900">2 Min</p>
                  <p className="text-xs text-gray-500 font-medium">Avg. Pickup Time</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-black text-gray-900">100%</p>
                  <p className="text-xs text-gray-500 font-medium">Verified Captains</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-black text-gray-900">4.9/5</p>
                  <p className="text-xs text-gray-500 font-medium">Rider Rating</p>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Booking Estimator */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
                <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                  <div>
                    <h3 className="font-extrabold text-gray-950 text-lg">Instant Fare Check</h3>
                    <p className="text-xs text-gray-500">Live GPS address matching & transparent rates</p>
                  </div>
                  <span className="bg-amber-400 text-gray-950 font-black text-xs px-2.5 py-1 rounded-full uppercase">
                    Live Rates
                  </span>
                </div>

                <form onSubmit={handleHeroBook} className="mt-5 space-y-4">
                  <LocationInput
                    label="Pickup Spot"
                    value={pickup}
                    onChange={(val) => setPickup(val)}
                    onSelectLocation={(item) => {
                      setPickup(item.name);
                      setPickupCoords(item.coords);
                    }}
                    placeholder="Enter pickup address (e.g. Connaught Place)"
                    iconColor="text-emerald-600"
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
                        <span>{isLocating || isAutoLocating ? 'Resolving GPS...' : 'My Current Location'}</span>
                      </button>
                    }
                  />

                  <LocationInput
                    label="Where To?"
                    value={destination}
                    onChange={(val) => setDestination(val)}
                    onSelectLocation={(item) => {
                      setDestination(item.name);
                      setDestCoords(item.coords);
                    }}
                    placeholder="Enter destination (e.g. Airport T3)"
                    iconColor="text-rose-600"
                  />

                  {/* Vehicle mini selector */}
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase text-gray-600 mb-2">Estimated Fares ({distanceKm || 5.2} KM)</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl border border-amber-400 bg-amber-50/50 text-center">
                        <Car className="w-5 h-5 mx-auto text-gray-900" />
                        <p className="text-[11px] font-bold text-gray-900 mt-1">Car</p>
                        <p className="text-xs font-black text-amber-700">{formatCurrency(fares.car)}</p>
                      </div>
                      <div className="p-2.5 rounded-xl border border-gray-200 bg-white text-center">
                        <Zap className="w-5 h-5 mx-auto text-gray-700" />
                        <p className="text-[11px] font-bold text-gray-900 mt-1">Auto</p>
                        <p className="text-xs font-black text-gray-700">{formatCurrency(fares.auto)}</p>
                      </div>
                      <div className="p-2.5 rounded-xl border border-gray-200 bg-white text-center">
                        <Car className="w-5 h-5 mx-auto text-gray-700" />
                        <p className="text-[11px] font-bold text-gray-900 mt-1">Moto</p>
                        <p className="text-xs font-black text-gray-700">{formatCurrency(fares.bike)}</p>
                      </div>
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
                    Proceed to Ride
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              Why RathoreTaxi?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mt-3 tracking-tight">
              Engineered for speed, safety, and comfort.
            </h2>
            <p className="text-gray-600 mt-3 text-base">
              Built with dedicated rider security and seamless driver partnership in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center font-bold mb-5 shadow-xs">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Instant Dispatch</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Advanced matching algorithms connect you with the nearest captain within seconds.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 text-amber-400 flex items-center justify-center font-bold mb-5 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Verified Captains</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Background-checked drivers, strict vehicle inspection, and live trip verification OTPs.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center font-bold mb-5 shadow-xs">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Upfront Fixed Pricing</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Know the exact fare before you ride. Zero surge surprises, pay via Cash or UPI.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 text-amber-400 flex items-center justify-center font-bold mb-5 shadow-xs">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">24/7 Dedicated Support</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Direct round-the-clock rider emergency helpline and customer assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ── */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              Seamless 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mt-3 tracking-tight">
              How RathoreTaxi Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs relative">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-gray-950 font-black text-lg flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900">Choose Pickup & Destination</h3>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Enter your exact pickup spot or use auto-detected GPS. View instant live fare breakdown.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs relative">
              <div className="w-12 h-12 rounded-full bg-gray-900 text-amber-400 font-black text-lg flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900">Match with Captain</h3>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Our network assigns a high-rated captain. Check vehicle details and track their live arrival.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs relative">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-gray-950 font-black text-lg flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900">Board & Travel Peacefully</h3>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Provide your secret 4-digit ride OTP to the captain and enjoy a safe, air-conditioned trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SAFETY COMMITMENT ── */}
      <section id="safety" className="py-20 bg-gray-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" /> Safety First Standard
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Your safety is our relentless commitment.
              </h2>
              <p className="text-gray-400 text-base leading-relaxed">
                Every trip on RathoreTaxi is fortified by strict protocols, 4-digit OTP handshake, verified identity checks, and emergency SOS assistance.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-200">Mandatory 4-Digit OTP Ride Verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-200">24/7 Monitored Driver GPS Tracks</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-200">Zero tolerance policy on passenger safety & misconduct</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-gray-950 font-black text-xl flex items-center justify-center">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Join as a Captain Partner</h4>
                  <p className="text-xs text-gray-400">Earn up to ₹45,000/month with flexible hours</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                Own a car, auto, or bike? Partner with RathoreTaxi and get daily payouts, low commissions, and dedicated captain support.
              </p>
              <Link
                to="/captain/register"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-amber-400 hover:bg-amber-500 text-gray-950 font-black rounded-full text-sm transition"
              >
                Register as Captain <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-gray-950 font-bold">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-gray-900">
                  Rathore<span className="text-amber-500">Taxi</span>
                </span>
                <p className="text-xs text-gray-500">© {new Date().getFullYear()} RathoreTaxi Inc. All rights reserved.</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600 font-medium">
              <Link to="/login" className="hover:text-gray-900">Rider Login</Link>
              <Link to="/register" className="hover:text-gray-900">Rider Register</Link>
              <Link to="/captain/login" className="hover:text-gray-900">Captain Portal</Link>
              <Link to="/captain/register" className="hover:text-gray-900">Drive with Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
