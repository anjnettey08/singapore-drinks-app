import { Restaurant, OpeningHours } from '../types/index';

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const isOpenNow = (restaurant: Restaurant): boolean => {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[now.getDay()] as OpeningHours['day'];
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const todayHours = restaurant.openingHours.find(h => h.day === currentDay);
  if (!todayHours || todayHours.isClosed) return false;

  const openTime = parseInt(todayHours.open.replace(':', ''));
  const closeTime = parseInt(todayHours.close.replace(':', ''));

  return currentTime >= openTime && currentTime <= closeTime;
};

export const isClosingSoon = (restaurant: Restaurant, minutesThreshold = 30): boolean => {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[now.getDay()] as OpeningHours['day'];
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const todayHours = restaurant.openingHours.find(h => h.day === currentDay);
  if (!todayHours || todayHours.isClosed) return false;

  const closeTime = parseInt(todayHours.close.replace(':', ''));
  const thresholdTime = currentTime + (minutesThreshold * 100 / 60); // Convert minutes to time format

  return thresholdTime >= closeTime && currentTime < closeTime;
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const formatRating = (rating: number): string => {
  return `★ ${rating.toFixed(1)}`;
};

export const getPriceRangeValue = (priceRange: string): number => {
  switch (priceRange) {
    case '$ ': return 1;
    case '$$ ': return 2;
    case '$$$ ': return 3;
    case '$$$$ ': return 4;
    default: return 0;
  }
};

export const formatOpeningHours = (hours: OpeningHours[]): string => {
  const today = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[today.getDay()] as OpeningHours['day'];
  
  const todayHours = hours.find(h => h.day === currentDay);
  
  if (!todayHours) return 'Hours not available';
  if (todayHours.isClosed) return 'Closed today';
  
  return `${todayHours.open} - ${todayHours.close}`;
};

export const getEstimatedTotalPrice = (selectedDrinks: any[], restaurant: Restaurant): number => {
  // This would calculate the total estimated price including all customizations
  // For now, returning a simplified calculation
  return selectedDrinks.length * 5; // Placeholder calculation
};