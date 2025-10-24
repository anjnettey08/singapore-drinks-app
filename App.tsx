import React, { useState } from 'react';
import DrinkSelectionScreen from './src/screens/DrinkSelectionScreen';
import FiltersScreen from './src/screens/FiltersScreen';
import RestaurantListScreen from './src/screens/RestaurantListScreen';
import { DrinkOrder, SearchFilters } from './src/types/index';
import './App.css';

type Screen = 'DrinkSelection' | 'Filters' | 'RestaurantList';

interface NavigationState {
  currentScreen: Screen;
  params?: any;
}

const App: React.FC = () => {
  const [navigation, setNavigation] = useState<NavigationState>({
    currentScreen: 'DrinkSelection',
  });

  const navigateTo = (screen: string, params?: any) => {
    setNavigation({
      currentScreen: screen as Screen,
      params,
    });
  };

  const renderCurrentScreen = () => {
    switch (navigation.currentScreen) {
      case 'DrinkSelection':
        return <DrinkSelectionScreen onNavigate={navigateTo} />;
      
      case 'Filters':
        return (
          <FiltersScreen 
            onNavigate={navigateTo}
            selectedDrinks={navigation.params?.selectedDrinks || []}
          />
        );
      
      case 'RestaurantList':
        return (
          <RestaurantListScreen 
            onNavigate={navigateTo}
            selectedDrinks={navigation.params?.selectedDrinks || []}
            filters={navigation.params?.filters}
          />
        );
      
      default:
        return <DrinkSelectionScreen onNavigate={navigateTo} />;
    }
  };

  const getPageTitle = () => {
    switch (navigation.currentScreen) {
      case 'DrinkSelection':
        return 'Select Drinks';
      case 'Filters':
        return 'Search Filters';
      case 'RestaurantList':
        return 'Restaurants';
      default:
        return 'Singapore Drinks App';
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          {navigation.currentScreen !== 'DrinkSelection' && (
            <button 
              className="back-button"
              onClick={() => {
                if (navigation.currentScreen === 'Filters') {
                  navigateTo('DrinkSelection');
                } else if (navigation.currentScreen === 'RestaurantList') {
                  navigateTo('Filters', navigation.params);
                }
              }}
            >
              ← Back
            </button>
          )}
          <h1 className="page-title">{getPageTitle()}</h1>
          <div className="header-spacer"></div>
        </div>
      </header>
      
      <main className="app-main">
        {renderCurrentScreen()}
      </main>
    </div>
  );
};

export default App;