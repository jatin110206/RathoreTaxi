import api from './axios';

/**
 * POST /users/register
 * Body: { fullname: { firstname, lastname }, email, password }
 * Response: { token, user }
 */
export const registerUser = (data) => api.post('/users/register', data);

/**
 * POST /users/login
 * Body: { email, password }
 * Response: { token, user }
 */
export const loginUser = (data) => api.post('/users/login', data);

/**
 * GET /users/profile
 * Auth: Bearer token required
 * Response: { user }
 */
export const getUserProfile = () => api.get('/users/profile');

/**
 * GET /users/logout
 * Auth: Bearer token required
 * Response: { message }
 */
export const logoutUser = () => api.get('/users/logout');
