import React, { useState } from 'react';
import DrinkSelectionScreen from './screens/DrinkSelectionScreen';
import FiltersScreen from './screens/FiltersScreen';
import RestaurantListScreen from './screens/RestaurantListScreen';
import SessionScreen from './screens/SessionScreen';
import SessionOrdersScreen from './screens/SessionOrdersScreen';
import { SessionProvider } from './contexts/SessionContext';
import { DrinkOrder, SearchFilters } from './types/index';
import './App.css';

type Screen = 'DrinkSelection' | 'Filters' | 'RestaurantList' | 'Session' | 'SessionOrders';

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
      
      case 'Session':
        return (
          <SessionScreen 
            onNavigateToOrders={() => navigateTo('SessionOrders')}
            onNavigateToBack={() => navigateTo('DrinkSelection')}
          />
        );
      
      case 'SessionOrders':
        return (
          <SessionOrdersScreen 
            onNavigateToBack={() => navigateTo('DrinkSelection')}
            onNavigateToSession={() => navigateTo('Session')}
          />
        );
      
      default:
        return <DrinkSelectionScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <SessionProvider>
      <div className="app">

        
        <main className="app-main">
          {renderCurrentScreen()}
        </main>
      </div>
    </SessionProvider>
  );
};

export default App;