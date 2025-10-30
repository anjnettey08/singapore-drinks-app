export interface DrinkType {
  id: string;
  name: string;
  category: 'coffee' | 'kopi' |'tea' | 'bubble-tea' | 'milk-tea' | 'fruit-tea' | 'cheese-tea' | 'juice' | 'soft-drink' | 'other-local-drinks' | 'alcohol';
  customizations: DrinkCustomization[];
  price: number; // Base price in SGD
}

export interface DrinkCustomization {
  id: string;
  name: string;
  displayName: string;
  type: 'sweetness' | 'temperature' | 'strength' | 'size' | 'ice' | 'extras';
  options: CustomizationOption[];
  isRequired: boolean;
  defaultOption?: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  displayName: string;
  priceModifier: number; // Additional cost (set to 0 since prices are removed)
  description?: string;
}

export interface DrinkOrder {
  drinkId: string;
  customizations: { [customizationId: string]: string }; // customizationId -> optionId
  quantity: number;
}

export interface SearchFilters {
  maxDistance: number; // in km
  priceRange: 'any' | 'under2' | '2to5' | '5to10' | 'above10'; // Price range categories
  minRating: number; // 1-5
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  openNowOnly: boolean;
  hasPromo: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  priceRange: '$ ' | '$$ ' | '$$$ ' | '$$$$ ';
  openingHours: OpeningHours[];
  availableDrinks: string[]; // Array of drink IDs
  hasPromo: boolean;
  promoDescription?: string;
  estimatedWaitTime?: number; // in minutes
  distance?: number; // calculated distance from user
}

export interface OpeningHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string; // "HH:MM" format
  close: string; // "HH:MM" format
  isClosed: boolean;
}

export type SortOption = 'distance' | 'rating' | 'price' | 'name';

export interface AppState {
  selectedDrinks: DrinkOrder[];
  searchFilters: SearchFilters;
  searchResults: Restaurant[];
  sortBy: SortOption;
  loading: boolean;
}

// Session-related interfaces for collaborative ordering
export interface SessionUser {
  id: string;
  name: string;
  joinedAt: Date;
}

export interface SessionOrder {
  id: string;
  userId: string;
  userName: string;
  restaurantId: string;
  restaurantName: string;
  drinkId: string;
  drinkName: string;
  customizations: { [customizationId: string]: string };
  quantity: number;
  price: number;
  orderedAt: Date;
}

export interface Session {
  id: string;
  creatorId: string;
  creatorName: string;
  createdAt: Date;
  users: SessionUser[];
  orders: SessionOrder[];
  isActive: boolean;
  totalAmount: number;
}

export interface SessionCreateRequest {
  creatorName: string;
}

export interface SessionJoinRequest {
  sessionId: string;
  userName: string;
}

export interface SessionResponse {
  success: boolean;
  session?: Session;
  message?: string;
  error?: string;
}

export interface AddOrderRequest {
  sessionId: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  drinkOrder: DrinkOrder;
  drinkName: string;
  totalPrice: number;
}

export interface AddRestaurantOrderRequest {
  sessionId: string;
  userId: string;
  restaurant: Restaurant;
  drinkOrders: DrinkOrder[];
}