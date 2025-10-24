import React, { useState, useEffect } from 'react';
import { SearchFilters, DrinkOrder, Restaurant, SortOption } from '../types/index';
import { singaporeRestaurants } from '../data/restaurants';
import { singaporeDrinks } from '../data/drinks';
import './RestaurantListScreen.css';

interface RestaurantListScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  selectedDrinks: DrinkOrder[];
  filters: SearchFilters & { 
    openNowFilter?: 'any' | 'yes' | 'no';
    promoFilter?: 'any' | 'yes' | 'no';
  };
}

const RestaurantListScreen: React.FC<RestaurantListScreenProps> = ({ 
  onNavigate, 
  selectedDrinks, 
  filters 
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [showClosingSoon, setShowClosingSoon] = useState(true);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    filterAndSortRestaurants();
  }, [sortBy, filters]);

  const filterAndSortRestaurants = () => {
    let restaurants = [...singaporeRestaurants];
    
    // Calculate distances (mock calculation)
    restaurants = restaurants.map(restaurant => ({
      ...restaurant,
      distance: calculateDistance(
        filters.location.latitude,
        filters.location.longitude,
        restaurant.location.latitude,
        restaurant.location.longitude
      ),
    }));

    // Filter by drink availability
    const selectedDrinkIds = selectedDrinks.map((order: DrinkOrder) => order.drinkId);
    restaurants = restaurants.filter(restaurant => 
      selectedDrinkIds.some((drinkId: string) => restaurant.availableDrinks.indexOf(drinkId) !== -1)
    );

    // Apply filters
    restaurants = restaurants.filter(restaurant => {
      // Distance filter (skip if "Any" is selected, which is -1)
      if (filters.maxDistance !== -1 && restaurant.distance! > filters.maxDistance) return false;
      
      // Rating filter (skip if "Any" is selected, which is -1)
      if (filters.minRating !== -1 && restaurant.rating < filters.minRating) return false;
      
      // Price filter based on drinks available at the restaurant
      if (filters.priceRange !== 'any') {
        const restaurantDrinks = restaurant.availableDrinks.map(drinkId => 
          singaporeDrinks.find(drink => drink.id === drinkId)
        ).filter(Boolean);
        
        const hasDrinksInPriceRange = restaurantDrinks.some(drink => {
          if (!drink) return false;
          
          switch (filters.priceRange) {
            case 'under2':
              return drink.price < 2;
            case '2to5':
              return drink.price >= 2 && drink.price <= 5;
            case '5to10':
              return drink.price > 5 && drink.price <= 10;
            case 'above10':
              return drink.price > 10;
            default:
              return true;
          }
        });
        
        if (!hasDrinksInPriceRange) return false;
      }
      
      // Promo filter - now handles 3 states: any, yes, no
      if (filters.promoFilter === 'yes' && !restaurant.hasPromo) return false;
      if (filters.promoFilter === 'no' && restaurant.hasPromo) return false;
      
      // Opening hours filter - now handles 3 states: any, yes (open), no (closed)
      if (filters.openNowFilter === 'yes' && !isOpenNow(restaurant)) return false;
      if (filters.openNowFilter === 'no' && isOpenNow(restaurant)) return false;
      
      return true;
    });

    // Sort restaurants
    restaurants.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return getPriceRangeValue(a.priceRange) - getPriceRangeValue(b.priceRange);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredRestaurants(restaurants);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Simplified distance calculation for demo
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getPriceRangeValue = (priceRange: string): number => {
    switch (priceRange) {
      case '$ ': return 1;
      case '$$ ': return 2;
      case '$$$ ': return 3;
      case '$$$$ ': return 4;
      default: return 0;
    }
  };

  const isOpenNow = (restaurant: Restaurant): boolean => {
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()] as any;
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const todayHours = restaurant.openingHours.find(h => h.day === currentDay);
    if (!todayHours || todayHours.isClosed) return false;
    
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const isClosingSoon = (restaurant: Restaurant): boolean => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const todayHours = restaurant.openingHours.find(h => h.day === currentDay as any);
    if (!todayHours || todayHours.isClosed) return false;
    
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    const thirtyMinutesFromNow = currentTime + 30;
    
    return thirtyMinutesFromNow >= closeTime && currentTime < closeTime;
  };

  const formatOpeningHours = (restaurant: Restaurant): string => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = restaurant.openingHours.find(h => h.day === currentDay as any);
    
    if (!todayHours) return 'Hours not available';
    if (todayHours.isClosed) return 'Closed today';
    
    return `${todayHours.open} - ${todayHours.close}`;
  };

  const getTodayAndTomorrowHours = (restaurant: Restaurant): { today: string; tomorrow: string } => {
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const todayHours = restaurant.openingHours.find(h => h.day === today as any);
    const tomorrowHours = restaurant.openingHours.find(h => h.day === tomorrowDay as any);
    
    const todayStr = todayHours 
      ? (todayHours.isClosed ? 'Closed' : `${todayHours.open} - ${todayHours.close}`)
      : 'Hours not available';
      
    const tomorrowStr = tomorrowHours 
      ? (tomorrowHours.isClosed ? 'Closed' : `${tomorrowHours.open} - ${tomorrowHours.close}`)
      : 'Hours not available';
    
    return { today: todayStr, tomorrow: tomorrowStr };
  };

  const makePhoneCall = (phoneNumber: string) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    } else {
      alert('No Phone Number: Phone number not available for this drink shop.');
    }
  };

  const openWebsite = (website: string) => {
    if (website) {
      window.open(website, '_blank');
    } else {
      alert('No Website: Website not available for this drink shop.');
    }
  };

  const openDirections = (lat: number, lng: number, name: string) => {
    // Open Google Maps with directions
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(googleMapsUrl, '_blank');
  };

  const renderSortButtons = () => (
    <div className="sort-container">
      <span className="sort-label">Sort by:</span>
      <div className="sort-buttons">
        {[
          { key: 'distance', label: 'Distance' },
          { key: 'rating', label: 'Rating' },
          { key: 'price', label: 'Price' },
          { key: 'name', label: 'Name' },
        ].map(option => (
          <button
            key={option.key}
            className={`sort-button ${sortBy === option.key ? 'selected' : ''}`}
            onClick={() => setSortBy(option.key as SortOption)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderRestaurant = (restaurant: Restaurant) => {
    const closingSoon = isClosingSoon(restaurant);
    const isOpen = isOpenNow(restaurant);
    
    return (
      <div key={restaurant.id} className="restaurant-card">
        {closingSoon && showClosingSoon && (
          <div className="closing-soon-banner">
            <span className="closing-soon-text">⏰ Closing in 30 minutes!</span>
          </div>
        )}
        
        <div className="restaurant-header">
          <h3 className="restaurant-name">{restaurant.name}</h3>
          <div className="rating-container">
            <span className="rating">★ {restaurant.rating}</span>
            <span className="review-count">({restaurant.reviewCount})</span>
          </div>
        </div>

        <p className="address">{restaurant.address}</p>
        
        {/* Opening Hours Section */}
        <div className="opening-hours-section">
          <div className="opening-hours-header">
            <span className="hours-icon">🕒</span>
            <span className="hours-title">Opening Hours</span>
          </div>
          {(() => {
            const hours = getTodayAndTomorrowHours(restaurant);
            return (
              <div className="hours-details">
                <div className="hours-row">
                  <span className="hours-day">Today:</span>
                  <span className={`hours-time ${isOpenNow(restaurant) ? 'open' : 'closed'}`}>
                    {hours.today}
                  </span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Tomorrow:</span>
                  <span className="hours-time">{hours.tomorrow}</span>
                </div>
              </div>
            );
          })()}
        </div>
        
        <div className="restaurant-info">
          <div className="info-item">
            <span className="info-label">Distance:</span>
            <span className="info-value">{restaurant.distance?.toFixed(1)} km</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Price:</span>
            <span className="info-value">{restaurant.priceRange}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span 
              className="info-value"
              style={{ color: isOpen ? '#4CAF50' : '#f44336' }}
            >
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          
          {restaurant.estimatedWaitTime && (
            <div className="info-item">
              <span className="info-label">Wait:</span>
              <span className="info-value">{restaurant.estimatedWaitTime} min</span>
            </div>
          )}
        </div>

        {restaurant.hasPromo && restaurant.promoDescription && (
          <div className="promo-container">
            <span className="promo-text">🎉 {restaurant.promoDescription}</span>
          </div>
        )}

        {/* Selected Drinks Available at this Shop */}
        <div className="available-drinks-section">
          <h4 className="available-drinks-title">Your Selected Drinks Available Here:</h4>
          <div className="available-drinks-list">
            {selectedDrinks
              .filter(order => restaurant.availableDrinks.includes(order.drinkId))
              .map((order, index) => {
                const drink = singaporeDrinks.find(d => d.id === order.drinkId);
                if (!drink) return null;
                
                return (
                  <div key={`${order.drinkId}-${index}`} className="available-drink-item">
                    <div className="drink-basic-info">
                      <span className="drink-name">{drink.name}</span>
                      <span className="drink-quantity">×{order.quantity}</span>
                    </div>
                    {Object.keys(order.customizations).length > 0 && (
                      <div className="drink-customizations">
                        {Object.entries(order.customizations).map(([customizationId, optionId]) => {
                          const customization = drink.customizations.find(c => c.id === customizationId);
                          const option = customization?.options.find(o => o.id === optionId);
                          return option ? (
                            <span key={customizationId} className="customization-tag">
                              {option.displayName}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="call-button"
            onClick={() => makePhoneCall(restaurant.phone || '')}
          >
            📞 Call
          </button>
          
          {restaurant.website && (
            <button
              className="website-button"
              onClick={() => openWebsite(restaurant.website!)}
            >
              🌐 Website
            </button>
          )}
          
          <button 
            className="directions-button"
            onClick={() => openDirections(restaurant.location.latitude, restaurant.location.longitude, restaurant.name)}
          >
            📍 Directions
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="restaurant-list-container">
      <div className="header">
        <h2 className="title">
          Found {filteredRestaurants.length} Drink Shop{filteredRestaurants.length !== 1 ? 's' : ''}
        </h2>
        <p className="subtitle">
          Serving your selected drinks near {filters.location.address}
        </p>
      </div>

      {renderSortButtons()}

      <div className="content-area">
        <div className="scroll-view">
          {filteredRestaurants.length === 0 ? (
            <div className="no-results-container">
              <p className="no-results-text">
                No drink shops found matching your criteria.
              </p>
              <p className="no-results-subtext">
                Try adjusting your filters or selecting different drinks.
              </p>
            </div>
          ) : (
            filteredRestaurants.map(renderRestaurant)
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantListScreen;