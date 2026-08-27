import { Star, Shield, Phone, MessageSquare, Car, KeyRound } from 'lucide-react';
import Button from './Button';

export default function CaptainCard({
  captain,
  otp,
  status = 'arriving',
  onCancel,
}) {
  const captainName = captain?.fullname
    ? `${captain.fullname.firstname} ${captain.fullname.lastname || ''}`.trim()
    : 'Captain Rajesh Rathore';

  const vehiclePlate = captain?.vehicle?.plate || 'DL 01 AB 7890';
  const vehicleType = (captain?.vehicle?.vehicleType || 'Car').toUpperCase();
  const vehicleColor = captain?.vehicle?.color || 'Silver';

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-lg space-y-4">
      {/* Status banner */}
      <div className="flex items-center justify-between bg-amber-50 rounded-2xl px-4 py-2.5 border border-amber-200/80">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
            {status === 'arrived' ? 'Captain is at pickup spot' : 'Captain is on the way'}
          </span>
        </div>
        <span className="text-xs font-black text-amber-950 bg-amber-200 px-2 py-0.5 rounded-md">
          ETA 2 MIN
        </span>
      </div>

      {/* Captain Profile & Vehicle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gray-900 text-amber-400 font-black text-lg flex items-center justify-center shadow-md">
              {captainName[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-1.5">
              {captainName}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" /> 4.9
              </span>
              <span>•</span>
              <span className="font-medium">1,240+ trips</span>
            </div>
          </div>
        </div>

        {/* Vehicle Badge */}
        <div className="text-right">
          <span className="inline-block bg-gray-900 text-white font-mono text-xs font-black px-2.5 py-1 rounded-lg tracking-wider shadow-xs">
            {vehiclePlate}
          </span>
          <p className="text-xs font-semibold text-gray-600 mt-1 capitalize">
            {vehicleColor} {vehicleType}
          </p>
        </div>
      </div>

      {/* OTP verification box */}
      {otp && (
        <div className="flex items-center justify-between bg-gray-900 text-white rounded-2xl p-3.5">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[11px] text-gray-400 uppercase font-semibold">Start Ride PIN</p>
              <p className="text-xs text-gray-300">Share with captain upon boarding</p>
            </div>
          </div>
          <div className="font-mono text-2xl font-black tracking-widest text-amber-400 bg-gray-800 px-3 py-1 rounded-xl border border-gray-700">
            {otp}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button
          variant="secondary"
          size="md"
          icon={Phone}
          onClick={() => alert('Calling Captain... (Feature preview)')}
        >
          Call Captain
        </Button>
        <Button
          variant="danger"
          size="md"
          onClick={onCancel}
        >
          Cancel Ride
        </Button>
      </div>
    </div>
  );
}
