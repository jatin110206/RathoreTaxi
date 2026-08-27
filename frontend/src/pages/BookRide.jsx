import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide, VEHICLE_TYPES } from '../context/RideContext';
import { 
  Car, 
  MapPin, 
  Locate, 
  ArrowRight, 
  CreditCard, 
  Navigation, 
  Sparkles,
  Loader2
} from 'lucide-react';
import VehicleOption from '../components/VehicleOption';
import LocationInput from '../components/LocationInput';
import Map from '../components/Map';
import Button from '../components/Button';
import { formatCurrency } from '../utils/formatters';
import { reverseGeocode, searchPlaces } from '../utils/geocoding';
import toast from 'react-hot-toast';

export default function BookRide() {
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
    setDistanceKm,
    getFares, 
    startRideSearch 
  } = useRide();

  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto detect current location on button click
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPickupCoords(coords);
        const resolvedAddress = await reverseGeocode(coords[0], coords[1]);
        setPickup(resolvedAddress);
        setIsLocating(false);
        toast.success('Pickup set to current GPS location');
      },
      (err) => {
        setIsLocating(false);
        toast.error('Unable to fetch GPS: ' + err.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // When user selects pickup from search
  const handleSelectPickup = (item) => {
    setPickup(item.name);
    setPickupCoords(item.coords);
    toast.success(`Pickup set: ${item.name}`);
  };

  // When user selects destination from search
  const handleSelectDest = (item) => {
    setDestination(item.name);
    setDestCoords(item.coords);
    toast.success(`Destination set: ${item.name}`);
  };

  // When user clicks anywhere on the Leaflet map
  const handleMapClick = async (coords) => {
    toast.loading('Resolving clicked address...', { id: 'map-reverse' });
    const address = await reverseGeocode(coords[0], coords[1]);
    toast.dismiss('map-reverse');

    // Default map click sets destination
    setDestCoords(coords);
    setDestination(address);
    toast.success(`Destination set: ${address}`);
  };

  const fares = getFares(distanceKm);
  const selectedFare = fares[selectedVehicle] || 120;

  const handleConfirmRide = (e) => {
    e.preventDefault();

    if (!pickup?.trim()) {
      toast.error('Please specify a pickup location');
      return;
    }
    if (!destination?.trim()) {
      toast.error('Please specify a destination');
      return;
    }

    setIsSubmitting(true);

    startRideSearch({
      pickup,
      pickupCoords,
      destination,
      destCoords,
      vehicleType: selectedVehicle,
      distanceKm: distanceKm,
    });

    toast.success('Searching for the closest RathoreTaxi Captain...');
    navigate('/ride/searching');
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              Book a RathoreTaxi
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Live location matching with real-time route calculation and fare estimation
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            OpenStreetMap Live Routing
          </div>
        </div>

        {/* ── 2-Column Split Booking Screen ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Booking Form & Vehicle Selection (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <form onSubmit={handleConfirmRide} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-5">
              
              {/* Location inputs with live Nominatim autocomplete */}
              <div className="space-y-4">
                <LocationInput
                  label="Pickup Location"
                  value={pickup}
                  onChange={(val) => setPickup(val)}
                  onSelectLocation={handleSelectPickup}
                  placeholder="Type address or locality (e.g. Connaught Place)"
                  iconColor="text-emerald-600"
                  required
                  autoDetectBtn={
                    <button
                      type="button"
                      onClick={handleDetectCurrentLocation}
                      disabled={isLocating}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                    >
                      {isLocating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Locate className="w-3.5 h-3.5" />
                      )}
                      <span>{isLocating ? 'Resolving GPS...' : 'My Current Location'}</span>
                    </button>
                  }
                />

                <LocationInput
                  label="Destination Spot"
                  value={destination}
                  onChange={(val) => setDestination(val)}
                  onSelectLocation={handleSelectDest}
                  placeholder="Where do you want to go? (e.g. Airport T3)"
                  iconColor="text-rose-600"
                  required
                />
              </div>

              {/* Distance Display Card */}
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-gray-800">Calculated Route Distance</span>
                </div>
                <span className="text-sm font-black text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full">
                  {distanceKm} KM
                </span>
              </div>

              {/* Vehicle category list */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Select Ride Category
                </label>
                <div className="space-y-2.5">
                  {VEHICLE_TYPES.map((v) => (
                    <VehicleOption
                      key={v.id}
                      vehicle={v}
                      fare={fares[v.id]}
                      isSelected={selectedVehicle === v.id}
                      onSelect={(id) => setSelectedVehicle(id)}
                    />
                  ))}
                </div>
              </div>

              {/* Fare breakdown card */}
              <div className="bg-gray-900 text-white rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Base + Distance ({distanceKm} km)</span>
                  <span>{formatCurrency(selectedFare)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Taxes & Urban Platform Fee</span>
                  <span className="text-emerald-400 font-bold">INCLUDED</span>
                </div>
                <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-amber-400">Total Guaranteed Fare</p>
                    <p className="text-xl font-black text-white">{formatCurrency(selectedFare)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-300 font-medium flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Cash / UPI
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                icon={ArrowRight}
                iconPosition="right"
              >
                Confirm & Request Captain
              </Button>
            </form>
          </div>

          {/* RIGHT COLUMN: Interactive Leaflet Map (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-gray-800">Interactive City Map</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">Click map to set drop spot</span>
              </div>

              <div className="h-[480px] lg:h-[580px] w-full">
                <Map
                  pickupCoords={pickupCoords}
                  destinationCoords={destCoords}
                  showRoute={true}
                  onLocationSelect={handleMapClick}
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
