import React, { useState, useEffect } from 'react';
import { DrinkType, DrinkOrder, DrinkCustomization, CustomizationOption } from '../types/index';
import { singaporeDrinks } from '../data/drinks';
import { useSession } from '../contexts/SessionContext';
import './DrinkSelectionScreen.css';

interface DrinkSelectionScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

// Draft selection interface
interface DraftSelection {
  drink: DrinkType;
  customizations: { [key: string]: string };
  quantity: number;
}

const DrinkSelectionScreen: React.FC<DrinkSelectionScreenProps> = ({ onNavigate }) => {
  const [selectedDrinks, setSelectedDrinks] = useState<DrinkOrder[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);
  const [customizingDrink, setCustomizingDrink] = useState<number | null>(null);
  
  // Draft selection state
  const [draftSelection, setDraftSelection] = useState<DraftSelection | null>(null);

  // Keyboard handling for Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && draftSelection) {
        cancelDraft();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [draftSelection]);
  
  // Session context
  const { 
    currentSession, 
    currentUser, 
    isInSession, 
    addOrderToSession,
    leaveSession,
    loading: sessionLoading,
    error: sessionError 
  } = useSession();

  // Group drinks by category with special handling for tea subcategories
  const drinksByCategory = singaporeDrinks.reduce((acc, drink) => {
    // Group all tea variants under "bubble-tea"
    const categoryKey = ['milk-tea', 'fruit-tea', 'cheese-tea'].includes(drink.category) 
      ? 'bubble-tea' 
      : drink.category;
      
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(drink);
    return acc;
  }, {} as Record<string, DrinkType[]>);

  // Group bubble tea drinks by subcategory for better organization
  const groupBubbleTeaDrinks = (drinks: DrinkType[]) => {
    return drinks.reduce((acc, drink) => {
      const subCategory = drink.category === 'bubble-tea' ? 'Classic Bubble Tea' :
                         drink.category === 'milk-tea' ? 'Milk Tea' :
                         drink.category === 'fruit-tea' ? 'Fruit Tea' :
                         drink.category === 'cheese-tea' ? 'Cheese Tea' : 'Other';
      
      if (!acc[subCategory]) {
        acc[subCategory] = [];
      }
      acc[subCategory].push(drink);
      return acc;
    }, {} as Record<string, DrinkType[]>);
  };

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
    'bubble-tea': 'Bubble Tea & Variants',
    'juice': 'Juices',
    'soft-drink': 'Soft Drinks',
    'other-local-drinks': 'Other Local Drinks',
    'alcohol': 'Alcohol',
  };

  // Subcategory emojis for bubble tea variants
  const subCategoryEmojis: { [key: string]: string } = {
    'Classic Bubble Tea': '🧋',
    'Milk Tea': '🥛',
    'Fruit Tea': '🍓',
    'Cheese Tea': '🧀'
  };

  // Draft selection functions
  const openDraftSelection = (drink: DrinkType) => {
    console.log('Opening draft selection for:', drink.name);
    const defaultCustomizations: { [key: string]: string } = {};
    
    drink.customizations.forEach((customization) => {
      if (customization.isRequired && customization.defaultOption) {
        defaultCustomizations[customization.id] = customization.defaultOption;
      }
    });

    const draft: DraftSelection = {
      drink,
      customizations: defaultCustomizations,
      quantity: 1,
    };

    setDraftSelection(draft);
    setCustomizingDrink(null); // Clear any existing customization
  };

  const cancelDraft = () => {
    setDraftSelection(null);
  };

  const updateDraftCustomization = (customizationId: string, optionId: string) => {
    if (!draftSelection) return;
    
    setDraftSelection({
      ...draftSelection,
      customizations: {
        ...draftSelection.customizations,
        [customizationId]: optionId
      }
    });
  };

  const updateDraftQuantity = (quantity: number) => {
    if (!draftSelection || quantity < 1) return;
    
    setDraftSelection({
      ...draftSelection,
      quantity
    });
  };

  // Validation: check if all required customizations are selected
  const isDraftValid = (): boolean => {
    if (!draftSelection) return false;
    
    return draftSelection.drink.customizations.every(customization => {
      if (customization.isRequired) {
        return draftSelection.customizations[customization.id] !== undefined;
      }
      return true;
    });
  };

  const commitDraft = async () => {
    if (!draftSelection || !isDraftValid()) return;

    const newOrder: DrinkOrder = {
      drinkId: draftSelection.drink.id,
      customizations: draftSelection.customizations,
      quantity: draftSelection.quantity,
    };

    // Check if identical item exists in cart (same drink + same options)
    const existingIndex = selectedDrinks.findIndex(order => 
      order.drinkId === newOrder.drinkId &&
      JSON.stringify(order.customizations) === JSON.stringify(newOrder.customizations)
    );

    if (existingIndex !== -1) {
      // Increment existing item quantity
      const updatedOrders = [...selectedDrinks];
      updatedOrders[existingIndex].quantity += newOrder.quantity;
      setSelectedDrinks(updatedOrders);
    } else {
      // Add new item to cart
      setSelectedDrinks([...selectedDrinks, newOrder]);
    }

    // If in a session, also add to session
    if (isInSession && currentSession && currentUser) {
      try {
        await addOrderToSession(newOrder, draftSelection.drink.name, draftSelection.drink.price);
      } catch (error) {
        console.error('Failed to add order to session:', error);
      }
    }

    // Clear draft
    setDraftSelection(null);
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
    const isOpening = expandedCategory !== category;
    setExpandedCategory(expandedCategory === category ? null : category);
    
    // Reset expanded subcategory when changing main category
    if (isOpening && category === 'bubble-tea') {
      // Auto-expand first subcategory when opening bubble tea
      setExpandedSubCategory('Classic Bubble Tea');
    } else {
      setExpandedSubCategory(null);
    }
  };

  const toggleSubCategory = (subCategory: string) => {
    setExpandedSubCategory(expandedSubCategory === subCategory ? null : subCategory);
  };

  const renderCustomizationOptions = (
    customization: DrinkCustomization,
    currentValue: string
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
            onClick={() => updateDraftCustomization(customization.id, option.id)}
          >
            <span className="option-name">{option.displayName}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDrinkOption = (drink: DrinkType) => (
    <div 
      key={drink.id} 
      className="drink-option clickable"
      onClick={() => openDraftSelection(drink)}
    >
      <div className="drink-info">
        <h4 className="drink-name">{drink.name}</h4>
      </div>
      <div className="add-drink-btn">
        <span className="add-icon">+</span>
      </div>
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
                order.customizations[customization.id] || ''
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
        <h1 className="main-title"> Singapore Local Drinks</h1>
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
                    {category === 'bubble-tea' ? (
                      // Special rendering for bubble tea with subcategories
                      Object.entries(groupBubbleTeaDrinks(drinks)).map(([subCategory, subDrinks]) => (
                        <div key={subCategory} className="subcategory-section">
                          <button
                            className={`subcategory-header ${expandedSubCategory === subCategory ? 'expanded' : ''}`}
                            onClick={() => toggleSubCategory(subCategory)}
                          >
                            <div className="subcategory-info">
                              <span className="subcategory-emoji">{subCategoryEmojis[subCategory] || '🥤'}</span>
                              <span className="subcategory-name">{subCategory}</span>
                              <span className="subcategory-count">({subDrinks.length})</span>
                            </div>
                            <span className={`subcategory-expand-icon ${expandedSubCategory === subCategory ? 'rotated' : ''}`}>
                              ▼
                            </span>
                          </button>
                          {expandedSubCategory === subCategory && (
                            <div className="subcategory-content">
                              <div className="drinks-grid">
                                {subDrinks.map(renderDrinkOption)}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      // Regular rendering for other categories
                      <div className="drinks-grid">
                        {drinks.map(renderDrinkOption)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Your Order */}
        <div className="right-panel">
          {/* Session Controls */}
          <div className="session-controls-sidebar">
            {isInSession ? (
              <div className="session-active">
                <div className="session-info">
                  <span className="session-indicator">👥 In Session: {currentSession?.id}</span>
                  <span className="session-members">{currentSession?.users.length} members</span>
                </div>
                <div className="session-actions">
                  <button 
                    className="session-btn view-orders"
                    onClick={() => onNavigate('SessionOrders')}
                  >
                    View Orders ({currentSession?.orders.length || 0})
                  </button>
                  <button 
                    className="session-btn session-details"
                    onClick={() => onNavigate('Session')}
                  >
                    Session Details
                  </button>
                  <button 
                    className="session-btn leave-session"
                    onClick={leaveSession}
                  >
                    🚪 Leave Session
                  </button>
                </div>
              </div>
            ) : (
              <div className="session-inactive">
                <p className="session-prompt">Planning a group order? Start a shared session!</p>
                <button 
                  className="session-btn create-join"
                  onClick={() => onNavigate('Session')}
                >
                  Create or Join Session
                </button>
              </div>
            )}

            {/* Session Error */}
            {sessionError && (
              <div className="session-error">
                <span>⚠️ {sessionError}</span>
              </div>
            )}
          </div>

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

      {/* Draft Selection Panel */}
      {draftSelection && (
        <div className="draft-overlay" onClick={cancelDraft}>
          <div className="draft-panel" onClick={(e) => e.stopPropagation()}>
            <div className="draft-header">
              <h3 className="draft-title">{draftSelection.drink.name}</h3>
              <p className="draft-subtitle">Customize your drink</p>
            </div>
            
            <div className="draft-content">
              {/* Quantity Selector */}
              <div className="draft-quantity-section">
                <label className="draft-quantity-label">Quantity</label>
                <div className="draft-quantity-controls">
                  <button 
                    className="draft-quantity-btn"
                    onClick={() => updateDraftQuantity(draftSelection.quantity - 1)}
                    disabled={draftSelection.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="draft-quantity-display">{draftSelection.quantity}</span>
                  <button 
                    className="draft-quantity-btn"
                    onClick={() => updateDraftQuantity(draftSelection.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Customizations */}
              <div className="draft-customizations">
                {draftSelection.drink.customizations.map((customization) => (
                  <div key={customization.id} className="draft-customization-group">
                    <label className="draft-customization-label">
                      {customization.displayName}
                      {customization.isRequired && <span className="draft-required"> *</span>}
                    </label>
                    <div className="draft-customization-options">
                      {customization.options.map((option) => (
                        <button
                          key={option.id}
                          className={`draft-customization-option ${
                            draftSelection.customizations[customization.id] === option.id ? 'selected' : ''
                          }`}
                          onClick={() => updateDraftCustomization(customization.id, option.id)}
                        >
                          <span className="draft-option-name">{option.displayName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="draft-actions">
              <button 
                className="draft-cancel-btn"
                onClick={cancelDraft}
              >
                Cancel
              </button>
              <button 
                className="draft-commit-btn"
                onClick={commitDraft}
                disabled={!isDraftValid()}
              >
                ✅ Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrinkSelectionScreen;