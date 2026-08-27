import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Locate, Navigation } from 'lucide-react';
import { fetchDrivingRoute } from '../utils/geocoding';

// Custom modern SVG icons
const createPickupIcon = () =>
  L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-200/80 font-black text-xs">
          A
        </div>
        <div class="absolute -bottom-1 w-2 h-2 bg-emerald-700 rotate-45"></div>
      </div>
    `,
    iconSize: [32, 36],
    iconAnchor: [16, 36],
  });

const createDropIcon = () =>
  L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl ring-4 ring-rose-200/80 font-black text-xs">
          B
        </div>
        <div class="absolute -bottom-1 w-2 h-2 bg-rose-700 rotate-45"></div>
      </div>
    `,
    iconSize: [32, 36],
    iconAnchor: [16, 36],
  });

const createCaptainIcon = () =>
  L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-11 h-11 rounded-full bg-gray-950 text-amber-400 flex items-center justify-center shadow-2xl ring-4 ring-amber-300 font-black text-base border-2 border-amber-400">
          🚕
        </div>
        <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
        </span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

export default function Map({
  pickupCoords,
  destinationCoords,
  showRoute = true,
  captainLocation = null,
  onLocationSelect,
  className = '',
  height = '100%',
  interactive = true,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ pickup: null, dest: null, captain: null, polyline: null, polylineOutline: null });
  const [locating, setLocating] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter = pickupCoords || destinationCoords || [23.2599, 77.4126]; // Default or India center

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      if (interactive && onLocationSelect) {
        map.on('click', (e) => {
          onLocationSelect([e.latlng.lat, e.latlng.lng]);
        });
      }

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers & Turn-by-Turn OSRM Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Cleanup old layers
    if (markersRef.current.pickup) map.removeLayer(markersRef.current.pickup);
    if (markersRef.current.dest) map.removeLayer(markersRef.current.dest);
    if (markersRef.current.captain) map.removeLayer(markersRef.current.captain);
    if (markersRef.current.polyline) map.removeLayer(markersRef.current.polyline);
    if (markersRef.current.polylineOutline) map.removeLayer(markersRef.current.polylineOutline);

    const latLngs = [];

    // Pickup
    if (pickupCoords && pickupCoords[0] && pickupCoords[1]) {
      const pMarker = L.marker(pickupCoords, { icon: createPickupIcon() })
        .addTo(map)
        .bindPopup('<b>Pickup Spot</b>');
      markersRef.current.pickup = pMarker;
      latLngs.push(pickupCoords);
    }

    // Destination
    if (destinationCoords && destinationCoords[0] && destinationCoords[1]) {
      const dMarker = L.marker(destinationCoords, { icon: createDropIcon() })
        .addTo(map)
        .bindPopup('<b>Destination Spot</b>');
      markersRef.current.dest = dMarker;
      latLngs.push(destinationCoords);
    }

    // Captain
    if (captainLocation && captainLocation[0] && captainLocation[1]) {
      const cMarker = L.marker(captainLocation, { icon: createCaptainIcon() })
        .addTo(map)
        .bindPopup('<b>Your Captain</b>');
      markersRef.current.captain = cMarker;
      latLngs.push(captainLocation);
    }

    // Turn-by-turn road route fetching
    if (showRoute && pickupCoords && destinationCoords) {
      let isMounted = true;

      fetchDrivingRoute(
        pickupCoords[0],
        pickupCoords[1],
        destinationCoords[0],
        destinationCoords[1]
      ).then((route) => {
        if (!isMounted || !mapInstanceRef.current) return;

        if (markersRef.current.polyline) mapInstanceRef.current.removeLayer(markersRef.current.polyline);
        if (markersRef.current.polylineOutline) mapInstanceRef.current.removeLayer(markersRef.current.polylineOutline);

        if (route.coordinates && route.coordinates.length > 0) {
          // Dark background border line
          const outline = L.polyline(route.coordinates, {
            color: '#1e293b',
            weight: 7,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(mapInstanceRef.current);

          // Vivid taxi yellow core road line (Google Maps style)
          const coreLine = L.polyline(route.coordinates, {
            color: '#f59e0b',
            weight: 5,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(mapInstanceRef.current);

          markersRef.current.polylineOutline = outline;
          markersRef.current.polyline = coreLine;

          const bounds = L.latLngBounds(route.coordinates);
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
      });

      return () => {
        isMounted = false;
      };
    } else if (latLngs.length > 1) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (latLngs.length === 1) {
      map.setView(latLngs[0], 14);
    }
  }, [pickupCoords, destinationCoords, captainLocation, showRoute]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setLocating(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(coords, 15);
        }
        if (onLocationSelect) {
          onLocationSelect(coords);
        }
      },
      (err) => {
        setLocating(false);
        console.warn('Geolocation error:', err.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl border border-gray-200 shadow-sm ${className}`} style={{ height }}>
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-0" />

      {/* Floating Control: Locate Me */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          className="p-3 bg-white hover:bg-gray-50 text-gray-800 rounded-full shadow-lg border border-gray-200/80 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          title="Detect Current GPS Location"
        >
          <Locate className={`w-5 h-5 ${locating ? 'animate-spin text-amber-500' : 'text-gray-700'}`} />
        </button>
      </div>

      {/* Brand Watermark Badge */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-gray-200 flex items-center gap-1.5 text-[11px] font-bold text-gray-800">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        RathoreTaxi Live Map
      </div>
    </div>
  );
}
