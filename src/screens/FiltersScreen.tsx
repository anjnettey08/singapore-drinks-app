import React, { useState } from 'react';
import { SearchFilters, DrinkOrder } from '../types/index';
import './FiltersScreen.css';

interface FiltersScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  selectedDrinks: DrinkOrder[];
}

const FiltersScreen: React.FC<FiltersScreenProps> = ({ onNavigate, selectedDrinks }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    maxDistance: -1, // -1 represents "Any" distance
    priceRange: 'any', // "Any" price range
    minRating: -1, // -1 represents "Any" rating
    location: {
      latitude: 1.2759, // 450 Alexandra Road coordinates
      longitude: 103.8018,
      address: '450 Alexandra Road, Singapore',
    },
    openNowOnly: false,
    hasPromo: false,
  });

  // Additional states for "Any" options on boolean filters
  const [openNowFilter, setOpenNowFilter] = useState<'any' | 'yes' | 'no'>('any');
  const [promoFilter, setPromoFilter] = useState<'any' | 'yes' | 'no'>('any');

  const [customLocation, setCustomLocation] = useState('');

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev: SearchFilters) => ({
      ...prev,
      [key]: value,
    }));
  };

  const searchDrinkShops = () => {
    // Validate filters (skip validation for "Any" values which are -1)
    if (filters.maxDistance !== -1 && filters.maxDistance <= 0) {
      alert('Invalid Filters: Distance must be greater than 0');
      return;
    }

    if (filters.minRating !== -1 && (filters.minRating < 1 || filters.minRating > 5)) {
      alert('Invalid Rating: Rating must be between 1 and 5');
      return;
    }

    // Create extended filters object with the additional filter states
    const extendedFilters = {
      ...filters,
      openNowFilter,
      promoFilter,
    };

    onNavigate('RestaurantList', { 
      selectedDrinks, 
      filters: extendedFilters 
    });
  };

  const useCurrentLocation = () => {
    // In a real app, this would use geolocation
    const confirmed = window.confirm(
      'This would request your current location in a real app. Using 450 Alexandra Road as demo location.'
    );
    
    if (confirmed) {
      updateFilter('location', {
        latitude: 1.2759,
        longitude: 103.8018,
        address: '450 Alexandra Road, Singapore (Current Location)',
      });
    }
  };

  const searchCustomLocation = () => {
    if (!customLocation.trim()) {
      alert('Invalid Location: Please enter a location');
      return;
    }

    // In a real app, this would use geocoding
    const confirmed = window.confirm(
      `Searching for "${customLocation}". Using Orchard Road as demo location.`
    );
    
    if (confirmed) {
      updateFilter('location', {
        latitude: 1.3048,
        longitude: 103.8318,
        address: customLocation,
      });
      setCustomLocation('');
    }
  };

  return (
    <div className="container">
      <div className="scroll-view">
        <h1 className="title">Search Filters</h1>
        
        {/* Selected Drinks Summary */}
        <div className="section">
          <h2 className="section-title">Selected Drinks</h2>
          <p className="drinks-summary">
            {selectedDrinks.length} drink{selectedDrinks.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        {/* Location */}
        <div className="section">
          <h2 className="section-title">Location</h2>
          <p className="current-location">
            Current: {filters.location.address}
          </p>
          
          <button
            className="location-button"
            onClick={useCurrentLocation}
          >
            Use Current Location
          </button>

          <div className="custom-location-container">
            <input
              type="text"
              className="location-input"
              placeholder="Enter custom location..."
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
            />
            <button
              className="search-location-button"
              onClick={searchCustomLocation}
            >
              Search
            </button>
          </div>
        </div>

        {/* Distance Filter */}
        <div className="section">
          <h2 className="section-title">Maximum Distance</h2>
          <div className="slider-container">
            <p className="slider-label">
              {filters.maxDistance === -1 ? 'Any distance' : `${filters.maxDistance} km`}
            </p>
            <div className="distance-buttons">
              <button
                className={`distance-button ${filters.maxDistance === -1 ? 'selected' : ''}`}
                onClick={() => updateFilter('maxDistance', -1)}
              >
                Any
              </button>
              {[1, 2, 5, 10, 20].map(distance => (
                <button
                  key={distance}
                  className={`distance-button ${filters.maxDistance === distance ? 'selected' : ''}`}
                  onClick={() => updateFilter('maxDistance', distance)}
                >
                  {distance}km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price Filter */}
        <div className="section">
          <h2 className="section-title">Price Range</h2>
          <div className="slider-container">
            <p className="slider-label">
              {filters.priceRange === 'any' ? 'Any price' : 
               filters.priceRange === 'under2' ? 'Under $2' :
               filters.priceRange === '2to5' ? '$2 to $5' :
               filters.priceRange === '5to10' ? '$5 to $10' :
               'Above $10'}
            </p>
            <div className="price-buttons">
              <button
                className={`price-button ${filters.priceRange === 'any' ? 'selected' : ''}`}
                onClick={() => updateFilter('priceRange', 'any')}
              >
                Any
              </button>
              <button
                className={`price-button ${filters.priceRange === 'under2' ? 'selected' : ''}`}
                onClick={() => updateFilter('priceRange', 'under2')}
              >
                &lt;$2
              </button>
              <button
                className={`price-button ${filters.priceRange === '2to5' ? 'selected' : ''}`}
                onClick={() => updateFilter('priceRange', '2to5')}
              >
                $2 to $5
              </button>
              <button
                className={`price-button ${filters.priceRange === '5to10' ? 'selected' : ''}`}
                onClick={() => updateFilter('priceRange', '5to10')}
              >
                $5 to $10
              </button>
              <button
                className={`price-button ${filters.priceRange === 'above10' ? 'selected' : ''}`}
                onClick={() => updateFilter('priceRange', 'above10')}
              >
                &gt;$10
              </button>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="section">
          <h2 className="section-title">Minimum Rating</h2>
          <div className="slider-container">
            <p className="slider-label">
              {filters.minRating === -1 ? 'Any rating' : `${filters.minRating} stars`}
            </p>
            <div className="rating-buttons">
              <button
                className={`rating-button ${filters.minRating === -1 ? 'selected' : ''}`}
                onClick={() => updateFilter('minRating', -1)}
              >
                Any
              </button>
              {[3.0, 3.5, 4.0, 4.5, 5.0].map(rating => (
                <button
                  key={rating}
                  className={`rating-button ${filters.minRating === rating ? 'selected' : ''}`}
                  onClick={() => updateFilter('minRating', rating)}
                >
                  {rating}★
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Filters */}
        <div className="section">
          <h2 className="section-title">Additional Filters</h2>
          
          <div className="filter-group">
            <label className="filter-group-label">Show open drink shops</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="openNow"
                  checked={openNowFilter === 'any'}
                  onChange={() => {
                    setOpenNowFilter('any');
                    updateFilter('openNowOnly', false);
                  }}
                />
                <span>Any</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="openNow"
                  checked={openNowFilter === 'yes'}
                  onChange={() => {
                    setOpenNowFilter('yes');
                    updateFilter('openNowOnly', true);
                  }}
                />
                <span>Open only</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="openNow"
                  checked={openNowFilter === 'no'}
                  onChange={() => {
                    setOpenNowFilter('no');
                    updateFilter('openNowOnly', false);
                  }}
                />
                <span>Closed only</span>
              </label>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-group-label">Promotions</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="promo"
                  checked={promoFilter === 'any'}
                  onChange={() => {
                    setPromoFilter('any');
                    updateFilter('hasPromo', false);
                  }}
                />
                <span>Any</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="promo"
                  checked={promoFilter === 'yes'}
                  onChange={() => {
                    setPromoFilter('yes');
                    updateFilter('hasPromo', true);
                  }}
                />
                <span>With promos</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="promo"
                  checked={promoFilter === 'no'}
                  onChange={() => {
                    setPromoFilter('no');
                    updateFilter('hasPromo', false);
                  }}
                />
                <span>No promos</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <button
          className="search-button"
          onClick={searchDrinkShops}
        >
          Find Drink Shops
        </button>
      </div>
    </div>
  );
};

export default FiltersScreen;