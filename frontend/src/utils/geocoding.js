/**
 * OpenStreetMap Nominatim Geocoding & OSRM Road Routing
 * 100% Free, Zero API Keys Required
 * Country priority: India (IN)
 */

// Search places / addresses by text query with strict India priority
export async function searchPlaces(query, countryCode = 'in') {
  if (!query || query.trim().length < 2) return [];

  try {
    const countryParam = countryCode ? `&countrycodes=${countryCode}` : '';
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query.trim()
      )}${countryParam}&limit=6&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.map((item) => ({
      id: item.place_id,
      displayName: item.display_name,
      shortName: formatShortAddress(item),
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch (error) {
    console.warn('Nominatim search error:', error);
    return [];
  }
}

// Reverse geocode lat/lng into a readable address
export async function reverseGeocode(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
        },
      }
    );

    if (!response.ok) return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

    const data = await response.json();
    return formatShortAddress(data) || data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (error) {
    console.warn('Nominatim reverse geocode error:', error);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

// Fetch precise road route geometry and driving distance from OSRM
export async function fetchDrivingRoute(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return { coordinates: [], distanceKm: 5.0 };
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('OSRM route failed');

    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = Math.max(0.5, Math.round((route.distance / 1000) * 10) / 10);
      // GeoJSON coordinates are [lon, lat], Leaflet wants [lat, lon]
      const coordinates = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
      return { coordinates, distanceKm, durationMinutes: Math.round(route.duration / 60) };
    }
  } catch (err) {
    console.warn('OSRM routing fallback to Haversine:', err.message);
  }

  // Fallback if OSRM unavailable
  const fallbackDistance = calculateHaversineDistance(lat1, lon1, lat2, lon2);
  return {
    coordinates: [
      [lat1, lon1],
      [lat2, lon2],
    ],
    distanceKm: fallbackDistance,
  };
}

// Calculate great-circle distance between two coordinates in kilometers (Haversine formula)
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0;

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.max(1, Math.round(distance * 1.3 * 10) / 10);
}

// Helper to format concise address from Nominatim details
function formatShortAddress(item) {
  if (!item.address) return item.display_name?.split(',').slice(0, 3).join(',') || '';

  const { road, suburb, neighbourhood, city, town, village, state, state_district } = item.address;
  const primary = item.name || road || neighbourhood || suburb || '';
  const secondary = suburb || city || town || village || state_district || state || '';

  if (primary && secondary && primary !== secondary) {
    return `${primary}, ${secondary}`;
  }
  return primary || secondary || item.display_name?.split(',').slice(0, 3).join(',') || 'Custom Location';
}
