import React, { useState } from 'react';
import { DrinkType, DrinkOrder, DrinkCustomization, CustomizationOption } from '../types/index';
import { singaporeDrinks } from '../data/drinks';
import './DrinkSelectionScreen.css';

interface DrinkSelectionScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

const DrinkSelectionScreen: React.FC<DrinkSelectionScreenProps> = ({ onNavigate }) => {
  const [selectedDrinks, setSelectedDrinks] = useState<DrinkOrder[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [customizingDrink, setCustomizingDrink] = useState<number | null>(null);

  // Group drinks by category
  const drinksByCategory = singaporeDrinks.reduce((acc, drink) => {
    if (!acc[drink.category]) {
      acc[drink.category] = [];
    }
    acc[drink.category].push(drink);
    return acc;
  }, {} as Record<string, DrinkType[]>);

  // Category emojis for better visual appeal
  const categoryEmojis: { [key: string]: string } = {
    'coffee': '☕',
    'kopi': '☕',
    'tea': '🍵',
    'bubble-tea': '🧋',
    'milk-tea': '🥛',
    'fruit-tea': '🍓',
    'cheese-tea': '🧀',
    'juice': '🥤',
    'soft-drink': '🥤',
    'other-local-drinks': '🍹',
    'alcohol': '🍺',
    'traditional': '🥤',
    'cold-drinks': '🧊',
    'specialty': '✨'
  };

  // Category display names
  const categoryNames: { [key: string]: string } = {
    'coffee': 'Coffee',
    'kopi': 'Kopi',
    'tea': 'Tea',
    'bubble-tea': 'Bubble Tea',
    'milk-tea': 'Milk Tea',
    'fruit-tea': 'Fruit Tea',
    'cheese-tea': 'Cheese Tea',
    'juice': 'Juices',
    'soft-drink': 'Soft Drinks',
    'other-local-drinks': 'Other Local Drinks',
    'alcohol': 'Alcohol',
  };

  const addDrink = (drink: DrinkType) => {
    const defaultCustomizations: { [key: string]: string } = {};
    
    drink.customizations.forEach((customization) => {
      if (customization.isRequired && customization.defaultOption) {
        defaultCustomizations[customization.id] = customization.defaultOption;
      }
    });

    const newOrder: DrinkOrder = {
      drinkId: drink.id,
      customizations: defaultCustomizations,
      quantity: 1,
    };

    setSelectedDrinks([...selectedDrinks, newOrder]);
    setCustomizingDrink(selectedDrinks.length);
  };

  const updateCustomization = (orderIndex: number, customizationId: string, optionId: string) => {
    const updatedOrders = [...selectedDrinks];
    updatedOrders[orderIndex].customizations[customizationId] = optionId;
    setSelectedDrinks(updatedOrders);
  };

  const updateQuantity = (orderIndex: number, quantity: number) => {
    if (quantity < 1) return;
    const updatedOrders = [...selectedDrinks];
    updatedOrders[orderIndex].quantity = quantity;
    setSelectedDrinks(updatedOrders);
  };

  const removeDrink = (index: number) => {
    const updatedOrders = selectedDrinks.filter((_: DrinkOrder, i: number) => i !== index);
    setSelectedDrinks(updatedOrders);
    if (customizingDrink === index) {
      setCustomizingDrink(null);
    }
  };

  const proceedToFilters = () => {
    onNavigate('Filters', { selectedDrinks });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const renderCustomizationOptions = (
    customization: DrinkCustomization,
    currentValue: string,
    orderIndex: number
  ) => (
    <div key={customization.id} className="customization-group">
      <label className="customization-label">
        {customization.displayName} {customization.isRequired && <span className="required">*</span>}
      </label>
      <div className="customization-options">
        {customization.options.map((option) => (
          <button
            key={option.id}
            className={`customization-option ${currentValue === option.id ? 'selected' : ''}`}
            onClick={() => updateCustomization(orderIndex, customization.id, option.id)}
          >
            <span className="option-name">{option.displayName}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDrinkOption = (drink: DrinkType) => (
    <div key={drink.id} className="drink-option">
      <div className="drink-info">
        <h4 className="drink-name">{drink.name}</h4>
      </div>
      <button
        className="add-drink-btn"
        onClick={() => addDrink(drink)}
        aria-label={`Add ${drink.name}`}
      >
        <span className="add-icon">+</span>
      </button>
    </div>
  );

  const renderSelectedDrink = (order: DrinkOrder, index: number) => {
    const drink = singaporeDrinks.find(d => d.id === order.drinkId);
    if (!drink) return null;

    const isCustomizing = customizingDrink === index;

    return (
      <div key={index} className={`selected-drink ${isCustomizing ? 'customizing' : ''}`}>
        <div className="selected-drink-header">
          <div className="drink-details">
            <h4 className="drink-name">{drink.name}</h4>
          </div>
          <div className="drink-controls">
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => updateQuantity(index, order.quantity - 1)}
                disabled={order.quantity <= 1}
              >
                -
              </button>
              <span className="quantity">{order.quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => updateQuantity(index, order.quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              className="customize-btn"
              onClick={() => setCustomizingDrink(isCustomizing ? null : index)}
            >
              {isCustomizing ? '✓' : '⚙️'}
            </button>
            <button
              className="remove-btn"
              onClick={() => removeDrink(index)}
            >
              ×
            </button>
          </div>
        </div>
        
        {isCustomizing && drink.customizations.length > 0 && (
          <div className="customization-panel">
            {drink.customizations.map((customization) =>
              renderCustomizationOptions(
                customization,
                order.customizations[customization.id] || '',
                index
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="drink-selection-container">
      <div className="header-section">
        <h1 className="main-title">🥤 Singapore Local Drinks</h1>
        <p className="subtitle">Choose your favorite local drinks</p>
      </div>
      
      <div className="main-content">
        {/* Left Side - Drink Selection */}
        <div className="left-panel">
          <div className="categories-section">
            {Object.entries(drinksByCategory).map(([category, drinks]) => (
              <div key={category} className="category-card">
                <button
                  className={`category-header ${expandedCategory === category ? 'expanded' : ''}`}
                  onClick={() => toggleCategory(category)}
                >
                  <div className="category-info">
                    <span className="category-emoji">{categoryEmojis[category] || '🥤'}</span>
                    <span className="category-name">
                      {categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </span>
                    <span className="category-count">({drinks.length})</span>
                  </div>
                  <span className={`expand-icon ${expandedCategory === category ? 'rotated' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {expandedCategory === category && (
                  <div className="category-content">
                    <div className="drinks-grid">
                      {drinks.map(renderDrinkOption)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Your Order */}
        <div className="right-panel">
          <div className="cart-section">
            <div className="cart-header">
              <h2 className="cart-title">🛒 Your Drinks</h2>
              <span className="cart-count">{selectedDrinks.length} item{selectedDrinks.length !== 1 ? 's' : ''}</span>
            </div>
            
            {selectedDrinks.length > 0 ? (
              <>
                <div className="selected-drinks">
                  {selectedDrinks.map(renderSelectedDrink)}
                </div>

                <button
                  className="proceed-button"
                  onClick={proceedToFilters}
                >
                  <span className="proceed-text">Find Drink Shops</span>
                  <span className="proceed-badge">{selectedDrinks.length}</span>
                </button>
              </>
            ) : (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p className="empty-cart-text">Craving for a Drink?</p>
                <p className="empty-cart-subtext">Start By Selecting Drinks From The Menu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkSelectionScreen;