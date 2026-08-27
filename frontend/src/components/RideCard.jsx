import { useState } from 'react';
import { 
  Car, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Calendar, 
  User 
} from 'lucide-react';
import { formatCurrency, formatDate, formatStatus, getVehicleLabel } from '../utils/formatters';

export default function RideCard({ ride }) {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = formatStatus(ride.status);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">
              {getVehicleLabel(ride.vehicleType)}
            </h4>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formatDate(ride.createdAt || ride.date)}
            </span>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <span className="font-black text-gray-900 text-base">
            {formatCurrency(ride.fare)}
          </span>
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border mt-0.5 ${statusInfo.bgClass}`}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Route Info */}
      <div className="py-3.5 space-y-2.5">
        <div className="flex items-start gap-2.5">
          <div className="mt-1 flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <div className="w-0.5 h-6 bg-gray-200 my-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100" />
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Pickup</p>
              <p className="font-semibold text-gray-800 line-clamp-1">{ride.pickup}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Destination</p>
              <p className="font-semibold text-gray-800 line-clamp-1">{ride.destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Details */}
      <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] text-gray-400">
          ID: {ride.id || 'RT-0000'}
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 font-bold text-amber-600 hover:text-amber-700"
        >
          {expanded ? 'Less Details' : 'Trip Details'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200 text-xs space-y-2 text-gray-600 bg-gray-50/70 p-3 rounded-xl">
          <div className="flex justify-between">
            <span>Distance:</span>
            <span className="font-semibold text-gray-900">{ride.distanceKm || '4.8'} km</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="font-semibold text-gray-900">Cash / UPI</span>
          </div>
          {ride.captain && (
            <div className="flex justify-between items-center pt-1 border-t border-gray-200">
              <span>Captain:</span>
              <span className="font-semibold text-gray-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {ride.captain?.fullname?.firstname || 'Assigned Driver'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
