export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateUserRegister = (formData) => {
  const errors = {};

  if (!formData.firstname || formData.firstname.trim().length < 3) {
    errors.firstname = 'First name must be at least 3 characters long';
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (formData.confirmPassword !== undefined && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUserLogin = (formData) => {
  const errors = {};

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCaptainRegister = (formData) => {
  const errors = {};

  if (!formData.firstname || formData.firstname.trim().length < 3) {
    errors.firstname = 'First name must be at least 3 characters long';
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (formData.confirmPassword !== undefined && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!formData.color || formData.color.trim().length < 3) {
    errors.color = 'Vehicle color must be at least 3 characters';
  }

  if (!formData.plate || formData.plate.trim().length < 3) {
    errors.plate = 'Plate number must be at least 3 characters (e.g. DL 01 AB 1234)';
  }

  const capacityNum = Number(formData.capacity);
  if (!formData.capacity || isNaN(capacityNum) || capacityNum < 1) {
    errors.capacity = 'Capacity must be at least 1 passenger';
  }

  if (!formData.vehicleType || !['car', 'bike', 'auto'].includes(formData.vehicleType)) {
    errors.vehicleType = 'Please select a valid vehicle type (Car, Auto, or Bike)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getApiErrorMessage = (error, defaultMsg = 'Something went wrong. Please try again.') => {
  if (!error) return defaultMsg;

  // express-validator array: { errors: [ { msg: '...' } ] }
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map((e) => e.msg || e.message).join(', ');
  }

  // Custom backend message: { message: '...' }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message === 'Network Error') {
    return 'Cannot connect to backend server. Make sure backend is running on http://localhost:4000';
  }

  return error.message || defaultMsg;
};
