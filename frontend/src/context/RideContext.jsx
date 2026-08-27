import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateHaversineDistance, reverseGeocode } from '../utils/geocoding';
import { useAuth } from './AuthContext';

const RideContext = createContext(null);

export const VEHICLE_TYPES = [
  {
    id: 'car',
    name: 'Rathore Prime Car',
    description: 'Affordable, compact & air-conditioned rides',
    capacity: 4,
    baseFare: 50,
    ratePerKm: 14,
    etaMinutes: 3,
    icon: 'Car',
  },
  {
    id: 'auto',
    name: 'Rathore Auto',
    description: 'Quick auto-rickshaws at pocket-friendly fares',
    capacity: 3,
    baseFare: 30,
    ratePerKm: 9,
    etaMinutes: 2,
    icon: 'Zap',
  },
  {
    id: 'bike',
    name: 'Rathore Moto Bike',
    description: 'Fastest single-rider commute through city traffic',
    capacity: 1,
    baseFare: 20,
    ratePerKm: 6,
    etaMinutes: 1,
    icon: 'Bike',
  },
];

export function RideProvider({ children }) {
  const { user } = useAuth();

  // Helper to get storage key unique to currently logged in user
  const getUserKey = useCallback(
    (prefix) => {
      const userIdentifier = user?._id || user?.email || 'guest';
      return `${prefix}_${userIdentifier}`;
    },
    [user]
  );

  const [pickup, setPickup] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destination, setDestination] = useState('');
  const [destCoords, setDestCoords] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [distanceKm, setDistanceKm] = useState(4.8);
  const [isAutoLocating, setIsAutoLocating] = useState(false);

  const [activeRide, setActiveRide] = useState(null);
  const [rideStatus, setRideStatus] = useState('idle');
  const [recentRides, setRecentRides] = useState([]);

  // Load user-specific active ride & ride history whenever active user changes
  useEffect(() => {
    if (user) {
      const userActiveRideKey = getUserKey('rt_active_ride');
      const userRidesKey = getUserKey('rt_recent_rides');

      const savedActive = localStorage.getItem(userActiveRideKey);
      if (savedActive) {
        try {
          const parsed = JSON.parse(savedActive);
          setActiveRide(parsed);
          setRideStatus(parsed.status || 'idle');
        } catch {
          setActiveRide(null);
          setRideStatus('idle');
        }
      } else {
        setActiveRide(null);
        setRideStatus('idle');
      }

      const savedHistory = localStorage.getItem(userRidesKey);
      if (savedHistory) {
        try {
          setRecentRides(JSON.parse(savedHistory));
        } catch {
          setRecentRides([]);
        }
      } else {
        setRecentRides([]);
      }
    } else {
      setActiveRide(null);
      setRideStatus('idle');
      setRecentRides([]);
    }
  }, [user, getUserKey]);

  // Auto-detect current GPS location on initial load
  useEffect(() => {
    if (!pickupCoords && navigator.geolocation) {
      setIsAutoLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setPickupCoords([lat, lon]);
          const address = await reverseGeocode(lat, lon);
          if (address) {
            setPickup(address);
          }
          setIsAutoLocating(false);
        },
        () => {
          setPickupCoords([28.6139, 77.2090]);
          setIsAutoLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // Recalculate distance whenever pickupCoords or destCoords change
  useEffect(() => {
    if (pickupCoords && destCoords) {
      const dist = calculateHaversineDistance(
        pickupCoords[0],
        pickupCoords[1],
        destCoords[0],
        destCoords[1]
      );
      setDistanceKm(dist);
    }
  }, [pickupCoords, destCoords]);

  // Persist active ride per user
  useEffect(() => {
    if (!user) return;
    const userActiveRideKey = getUserKey('rt_active_ride');

    if (activeRide) {
      localStorage.setItem(userActiveRideKey, JSON.stringify(activeRide));
      setRideStatus(activeRide.status);
    } else {
      localStorage.removeItem(userActiveRideKey);
      setRideStatus('idle');
    }
  }, [activeRide, user, getUserKey]);

  // Persist recent rides per user
  useEffect(() => {
    if (!user) return;
    const userRidesKey = getUserKey('rt_recent_rides');
    localStorage.setItem(userRidesKey, JSON.stringify(recentRides));
  }, [recentRides, user, getUserKey]);

  // Calculate fare estimates based on distance
  const getFares = (km = distanceKm) => {
    return VEHICLE_TYPES.reduce((acc, v) => {
      const calculated = Math.round(v.baseFare + km * v.ratePerKm);
      acc[v.id] = calculated;
      return acc;
    }, {});
  };

  const calculateFares = (dist) => {
    const validDist = dist && dist > 0 ? dist : 4.8;
    setDistanceKm(validDist);
    return getFares(validDist);
  };

  const startRideSearch = (bookingDetails) => {
    const fares = getFares(bookingDetails.distanceKm || distanceKm);
    const newRide = {
      id: 'RT-' + Math.floor(100000 + Math.random() * 900000),
      userId: user?._id || user?.email,
      userEmail: user?.email,
      pickup: bookingDetails.pickup || pickup,
      pickupCoords: bookingDetails.pickupCoords || pickupCoords,
      destination: bookingDetails.destination || destination,
      destCoords: bookingDetails.destCoords || destCoords,
      vehicleType: bookingDetails.vehicleType || selectedVehicle,
      fare: fares[bookingDetails.vehicleType || selectedVehicle] || 120,
      distanceKm: bookingDetails.distanceKm || distanceKm,
      status: 'searching',
      createdAt: new Date().toISOString(),
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      captain: null,
    };
    setActiveRide(newRide);
    return newRide;
  };

  const updateRideState = (updatedFields) => {
    setActiveRide((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      if (updated.status === 'completed' || updated.status === 'cancelled') {
        setRecentRides((history) => [updated, ...history.filter((r) => r.id !== updated.id)]);
      }
      return updated;
    });
  };

  const cancelActiveRide = () => {
    if (activeRide) {
      const cancelledRide = { ...activeRide, status: 'cancelled', cancelledAt: new Date().toISOString() };
      setRecentRides((history) => [cancelledRide, ...history.filter((r) => r.id !== cancelledRide.id)]);
    }
    setActiveRide(null);
    setRideStatus('idle');
  };

  const completeActiveRide = () => {
    if (activeRide) {
      const completedRide = { ...activeRide, status: 'completed', completedAt: new Date().toISOString() };
      setRecentRides((history) => [completedRide, ...history.filter((r) => r.id !== completedRide.id)]);
    }
    setActiveRide(null);
    setRideStatus('idle');
  };

  return (
    <RideContext.Provider
      value={{
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
        isAutoLocating,
        activeRide,
        rideStatus,
        recentRides,
        getFares,
        calculateFares,
        startRideSearch,
        updateRideState,
        cancelActiveRide,
        completeActiveRide,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
}

export default RideContext;
