import api from './axios';

/**
 * POST /captain/register
 * Body: {
 *   fullname: { firstname, lastname },
 *   email,
 *   password,
 *   vehicle: { color, plate, capacity, vehicleType }
 * }
 * Response: { token, captain }
 */
export const registerCaptain = (data) => api.post('/captain/register', data);

/**
 * POST /captain/login
 * Body: { email, password }
 * Response: { token, captain }
 */
export const loginCaptain = (data) => api.post('/captain/login', data);

/**
 * GET /captain/profile
 * Auth: Bearer token required
 * Response: { captain }
 */
export const getCaptainProfile = () => api.get('/captain/profile');

/**
 * GET /captain/logout
 * Auth: Bearer token required
 * Response: { message }
 */
export const logoutCaptain = () => api.get('/captain/logout');
