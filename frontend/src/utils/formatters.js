export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Math.round(Number(amount))}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recently';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatStatus = (status) => {
  switch (status) {
    case 'searching':
      return { label: 'Finding Captain', bgClass: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'accepted':
      return { label: 'Captain Assigned', bgClass: 'bg-blue-100 text-blue-800 border-blue-300' };
    case 'arriving':
      return { label: 'Captain Arriving', bgClass: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    case 'arrived':
      return { label: 'Captain Arrived', bgClass: 'bg-purple-100 text-purple-800 border-purple-300' };
    case 'started':
      return { label: 'Ride In Progress', bgClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case 'completed':
      return { label: 'Completed', bgClass: 'bg-green-100 text-green-800 border-green-300' };
    case 'cancelled':
      return { label: 'Cancelled', bgClass: 'bg-red-100 text-red-800 border-red-300' };
    default:
      return { label: status || 'Pending', bgClass: 'bg-gray-100 text-gray-800 border-gray-300' };
  }
};

export const getVehicleLabel = (type) => {
  switch (type?.toLowerCase()) {
    case 'car':
      return 'Rathore Prime Car';
    case 'auto':
      return 'Rathore Auto';
    case 'bike':
      return 'Rathore Moto Bike';
    default:
      return type ? type.toUpperCase() : 'Car';
  }
};
