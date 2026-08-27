/**
 * rideApi.js
 *
 * TODO: The backend does NOT yet have ride-related APIs.
 * These functions are scaffolded for future implementation.
 * When the backend adds ride endpoints, update these functions
 * to make real API calls.
 */

// import api from './axios';

/**
 * TODO: POST /rides/create
 * Book a new ride
 */
export const createRide = async (_data) => {
  // return api.post('/rides/create', data);
  throw new Error('Ride API not yet implemented in backend');
};

/**
 * TODO: GET /rides/history
 * Get user's ride history
 */
export const getRideHistory = async () => {
  // return api.get('/rides/history');
  return { data: { rides: [] } }; // Return empty until backend is ready
};

/**
 * TODO: GET /rides/fare
 * Estimate fare for a route
 */
export const estimateFare = async (_data) => {
  // return api.get('/rides/fare', { params: data });
  return null;
};

/**
 * TODO: PATCH /rides/:id/status
 * Update ride status (captain use)
 */
export const updateRideStatus = async (_rideId, _status) => {
  // return api.patch(`/rides/${rideId}/status`, { status });
  throw new Error('Ride API not yet implemented in backend');
};
