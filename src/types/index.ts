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