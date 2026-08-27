import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { Car, Clock, Filter, ArrowRight, Shield } from 'lucide-react';
import RideCard from '../components/RideCard';
import Button from '../components/Button';

export default function RideHistory() {
  const { recentRides } = useRide();
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'cancelled'

  const filteredRides = recentRides.filter((ride) => {
    if (filter === 'completed') return ride.status === 'completed';
    if (filter === 'cancelled') return ride.status === 'cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
          <div>
            <span className="text-xs font-black uppercase text-amber-600 bg-amber-100 px-3 py-0.5 rounded-full">
              Trip History
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
              Your Past Rides
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              View trip summaries, receipts, and re-book your daily routes
            </p>
          </div>

          <Link
            to="/book"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 text-gray-950 font-bold rounded-full text-sm hover:bg-amber-500 transition shadow-sm"
          >
            <Car className="w-4 h-4" /> Book New Ride
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Trips ({recentRides.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              filter === 'cancelled'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Ride list */}
        {filteredRides.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">No rides in this view</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                {filter === 'all'
                  ? 'You haven\'t taken any rides yet. Book a ride and travel conveniently with RathoreTaxi.'
                  : `No ${filter} rides recorded.`}
              </p>
            </div>
            <Link
              to="/book"
              className="inline-block px-6 py-2.5 bg-amber-400 text-gray-950 font-bold text-xs rounded-full hover:bg-amber-500 transition"
            >
              Book Your Ride Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredRides.map((ride, idx) => (
              <RideCard key={ride.id || idx} ride={ride} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
