import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRide } from '../context/RideContext';
import { logoutUser } from '../api/authApi';
import { logoutCaptain } from '../api/captainApi';
import { 
  Car, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Clock, 
  Compass, 
  Shield, 
  Radio, 
  ChevronRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, captain, isAuthenticated, isCaptainAuthenticated, clearSession } = useAuth();
  const { activeRide } = useRide();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      if (isCaptainAuthenticated) {
        await logoutCaptain().catch(() => {});
        toast.success('Captain logged out safely');
        navigate('/captain/login');
      } else {
        await logoutUser().catch(() => {});
        toast.success('Logged out successfully');
        navigate('/login');
      }
    } finally {
      clearSession();
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo / Brand */}
          <Link 
            to={isCaptainAuthenticated ? '/captain/dashboard' : isAuthenticated ? '/home' : '/'} 
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-gray-900 shadow-md group-hover:scale-105 transition-transform duration-200 font-bold">
              <Car className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-gray-900 flex items-center gap-1">
                Rathore<span className="text-amber-500">Taxi</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-gray-700 uppercase -mt-1">
                {isCaptainAuthenticated ? 'Captain Partner' : 'Your Ride, Your Way'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {!isAuthenticated && !isCaptainAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent('/') ? 'text-gray-900 bg-gray-100 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>
                <a
                  href="/#features"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Features
                </a>
                <a
                  href="/#how-it-works"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="/#safety"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Safety
                </a>
                <div className="h-4 w-px bg-gray-300 mx-2" />
                <Link
                  to="/captain/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-amber-50 transition-colors"
                >
                  <Shield className="w-4 h-4 text-amber-500" />
                  Drive with Us
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-full text-sm font-bold bg-amber-400 text-gray-950 hover:bg-amber-500 shadow-sm hover:shadow-md transition-all duration-150"
                >
                  Register
                </Link>
              </>
            ) : isAuthenticated ? (
              // Passenger Logged In
              <>
                <Link
                  to="/home"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent('/home') ? 'text-gray-900 bg-gray-100 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/book"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent('/book') ? 'text-gray-900 bg-gray-100 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  Book Ride
                </Link>
                <Link
                  to="/rides"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent('/rides') ? 'text-gray-900 bg-gray-100 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  My Rides
                </Link>

                {activeRide && activeRide.status !== 'completed' && activeRide.status !== 'cancelled' && (
                  <Link
                    to="/ride/searching"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse ml-2"
                  >
                    <Radio className="w-3.5 h-3.5 text-amber-600" />
                    Active Ride
                  </Link>
                )}

                <div className="h-4 w-px bg-gray-300 mx-2" />

                {/* Profile menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-amber-400 flex items-center justify-center font-bold text-xs uppercase">
                      {user?.fullname?.firstname?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate">
                      {user?.fullname?.firstname || 'User'}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.fullname?.firstname} {user?.fullname?.lastname}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <UserIcon className="w-4 h-4 text-gray-500" />
                        My Profile
                      </Link>
                      <Link
                        to="/rides"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Clock className="w-4 h-4 text-gray-500" />
                        Ride History
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Captain Logged In
              <>
                <Link
                  to="/captain/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent('/captain/dashboard') ? 'text-gray-900 bg-gray-100 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Radio className="w-4 h-4 text-amber-500" />
                  Captain Live Panel
                </Link>
                <Link
                  to="/captain/rides"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent('/captain/rides') ? 'text-gray-900 bg-gray-100 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  Assigned Rides
                </Link>

                <div className="h-4 w-px bg-gray-300 mx-2" />

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-amber-50 transition-colors border border-amber-200 bg-amber-50/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center font-bold text-xs uppercase">
                      {captain?.fullname?.firstname?.[0] || 'C'}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-900 leading-tight">
                        Capt. {captain?.fullname?.firstname || 'Partner'}
                      </p>
                      <p className="text-[10px] text-amber-700 font-semibold uppercase">
                        {captain?.vehicle?.vehicleType || 'Driver'}
                      </p>
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100 bg-amber-50/50">
                        <p className="text-xs text-amber-800 font-semibold uppercase">Verified Captain</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{captain?.email}</p>
                        <div className="mt-1 text-[11px] font-mono text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200 inline-block">
                          {captain?.vehicle?.plate} • {captain?.vehicle?.color}
                        </div>
                      </div>
                      <Link
                        to="/captain/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <UserIcon className="w-4 h-4 text-gray-500" />
                        Captain Profile
                      </Link>
                      <Link
                        to="/captain/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Compass className="w-4 h-4 text-gray-500" />
                        Duty Dashboard
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out Duty
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {activeRide && activeRide.status !== 'completed' && activeRide.status !== 'cancelled' && (
              <Link
                to="/ride/searching"
                className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-gray-950 animate-pulse"
              >
                Live Ride
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {!isAuthenticated && !isCaptainAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-gray-800 hover:bg-gray-50"
              >
                Home <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-gray-800 hover:bg-gray-50"
              >
                Sign In as Rider <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-bold text-gray-900 bg-amber-50 text-amber-900"
              >
                Create Rider Account <ChevronRight className="w-4 h-4 text-amber-600" />
              </Link>
              <div className="border-t border-gray-100 my-2 pt-2" />
              <Link
                to="/captain/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-semibold text-gray-800 hover:bg-gray-50"
              >
                Captain Sign In <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                to="/captain/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-bold text-gray-950 bg-amber-400"
              >
                Drive with RathoreTaxi <ChevronRight className="w-4 h-4 text-gray-950" />
              </Link>
            </>
          ) : isAuthenticated ? (
            <>
              <div className="px-3 py-2 bg-gray-50 rounded-xl mb-2">
                <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                <p className="text-sm font-bold text-gray-900">
                  {user?.fullname?.firstname} {user?.fullname?.lastname}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Link
                to="/home"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <Compass className="w-5 h-5 text-amber-500" /> Dashboard
              </Link>
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <Car className="w-5 h-5 text-amber-500" /> Book a Ride
              </Link>
              <Link
                to="/rides"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <Clock className="w-5 h-5 text-amber-500" /> Ride History
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <UserIcon className="w-5 h-5 text-amber-500" /> My Profile
              </Link>
              <div className="border-t border-gray-100 my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <div className="px-3 py-2 bg-amber-50 rounded-xl mb-2 border border-amber-200">
                <p className="text-xs text-amber-800 font-semibold uppercase">Captain Partner</p>
                <p className="text-sm font-bold text-gray-900">
                  {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                </p>
                <p className="text-xs text-gray-600">{captain?.vehicle?.plate} ({captain?.vehicle?.vehicleType})</p>
              </div>
              <Link
                to="/captain/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <Radio className="w-5 h-5 text-amber-500" /> Driver Duty Panel
              </Link>
              <Link
                to="/captain/rides"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <Car className="w-5 h-5 text-amber-500" /> Assigned Rides
              </Link>
              <Link
                to="/captain/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <UserIcon className="w-5 h-5 text-amber-500" /> Captain Profile
              </Link>
              <div className="border-t border-gray-100 my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-5 h-5" /> Sign Out Duty
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
