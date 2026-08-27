import { Car, Bike, Zap, User, Clock, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const iconMap = {
  car: Car,
  auto: Zap,
  bike: Bike,
};

export default function VehicleOption({
  vehicle,
  fare,
  isSelected,
  onSelect,
}) {
  const IconComponent = iconMap[vehicle.id] || Car;

  return (
    <div
      onClick={() => onSelect(vehicle.id)}
      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${
        isSelected
          ? 'border-amber-400 bg-amber-50/40 shadow-md ring-2 ring-amber-400/20'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-amber-400 text-gray-950 shadow-sm'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <IconComponent className="w-7 h-7" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900 text-base">{vehicle.name}</h4>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              <User className="w-3 h-3" /> {vehicle.capacity}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{vehicle.description}</p>
          <div className="flex items-center gap-1 mt-1 text-xs font-medium text-amber-700">
            <Clock className="w-3 h-3" />
            <span>{vehicle.etaMinutes} min away</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-lg font-black text-gray-900">{formatCurrency(fare)}</div>
        {isSelected ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full mt-1">
            <Check className="w-3 h-3" /> Selected
          </span>
        ) : (
          <span className="text-xs text-gray-400 font-medium">Click to choose</span>
        )}
      </div>
    </div>
  );
}
