import React, { useEffect, useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { SessionOrder, DrinkType, DrinkCustomization } from '../types';
import { singaporeDrinks } from '../data/drinks';
import './SessionOrdersScreen.css';

interface SessionOrdersScreenProps {
  onNavigateToBack: () => void;
  onNavigateToSession: () => void;
}

interface GroupedOrders {
  [drinkId: string]: {
    drinkName: string;
    price: number;
    totalQuantity: number;
    orders: SessionOrder[];
  };
}

interface RestaurantGroupedOrders {
  [restaurantId: string]: {
    restaurantName: string;
    orders: SessionOrder[];
    totalAmount: number;
    userOrders: { [userId: string]: { userName: string; orders: SessionOrder[]; totalAmount: number } };
  };
}

export default function SessionOrdersScreen({ onNavigateToBack, onNavigateToSession }: SessionOrdersScreenProps) {
  const { currentSession, currentUser, refreshSession, loading, closeSession } = useSession();
  const [viewMode, setViewMode] = useState<'drink' | 'user' | 'restaurant'>('restaurant');
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  useEffect(() => {
    // Auto-refresh session data every 10 seconds
    const interval = setInterval(() => {
      refreshSession();
    }, 10000);

    return () => clearInterval(interval);
  }, [refreshSession]);

  if (!currentSession || !currentUser) {
    return (
      <div className="session-orders-screen">
        <div className="session-orders-header">
          <button className="back-btn" onClick={onNavigateToBack}>
            ← Back
          </button>
          <h1>No Active Session</h1>
        </div>
        <div className="no-session-message">
          <p>You need to be in a session to view orders.</p>
          <button onClick={onNavigateToSession} className="join-session-btn">
            Join or Create Session
          </button>
        </div>
      </div>
    );
  }

  // Group orders by drink
  const groupedOrders: GroupedOrders = currentSession.orders.reduce((acc, order) => {
    if (!acc[order.drinkId]) {
      acc[order.drinkId] = {
        drinkName: order.drinkName,
        price: order.price / order.quantity, // Get unit price
        totalQuantity: 0,
        orders: []
      };
    }
    acc[order.drinkId].totalQuantity += order.quantity;
    acc[order.drinkId].orders.push(order);
    return acc;
  }, {} as GroupedOrders);

  // Group orders by user
  const ordersByUser = currentSession.orders.reduce((acc, order) => {
    if (!acc[order.userId]) {
      acc[order.userId] = {
        userName: order.userName,
        orders: [],
        totalAmount: 0
      };
    }
    acc[order.userId].orders.push(order);
    acc[order.userId].totalAmount += order.price;
    return acc;
  }, {} as { [userId: string]: { userName: string; orders: SessionOrder[]; totalAmount: number } });

  // Group orders by restaurant
  const ordersByRestaurant: RestaurantGroupedOrders = currentSession.orders.reduce((acc, order) => {
    const restaurantId = order.restaurantId || 'unknown';
    const restaurantName = order.restaurantName || 'Unknown Restaurant';
    
    if (!acc[restaurantId]) {
      acc[restaurantId] = {
        restaurantName,
        orders: [],
        totalAmount: 0,
        userOrders: {}
      };
    }
    
    // Add to restaurant total
    acc[restaurantId].orders.push(order);
    acc[restaurantId].totalAmount += order.price;
    
    // Group by user within restaurant
    if (!acc[restaurantId].userOrders[order.userId]) {
      acc[restaurantId].userOrders[order.userId] = {
        userName: order.userName,
        orders: [],
        totalAmount: 0
      };
    }
    acc[restaurantId].userOrders[order.userId].orders.push(order);
    acc[restaurantId].userOrders[order.userId].totalAmount += order.price;
    
    return acc;
  }, {} as RestaurantGroupedOrders);

  const handleCloseSession = async () => {
    const response = await closeSession();
    if (response.success) {
      onNavigateToSession();
    }
    setShowCloseConfirm(false);
  };

  const getCustomizationText = (customizations: { [key: string]: string }) => {
    const drink = singaporeDrinks.find((d: DrinkType) => d.id === Object.keys(groupedOrders).find(key => 
      groupedOrders[key].orders.some(order => order.customizations === customizations)
    ));
    
    if (!drink) return '';

    return Object.entries(customizations)
      .map(([customizationId, optionId]) => {
        const customization = drink.customizations.find((c: DrinkCustomization) => c.id === customizationId);
        const option = customization?.options.find((o: any) => o.id === optionId);
        return option ? option.displayName : '';
      })
      .filter(Boolean)
      .join(', ');
  };

  const isCreator = currentUser.id === currentSession.creatorId;

  return (
    <div className="session-orders-screen">
      <div className="session-orders-header">
        <button className="back-btn" onClick={onNavigateToBack}>
          ← Back
        </button>
        <div className="header-content">
          <h1>Group Orders</h1>
          <div className="session-info">
            <span className="session-id">Session: {currentSession.id}</span>
            <span className="session-total">${currentSession.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <button className="refresh-btn" onClick={refreshSession} disabled={loading}>
          {loading ? '⟳' : '↻'}
        </button>
      </div>

      <div className="orders-controls">
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'restaurant' ? 'active' : ''}`}
            onClick={() => setViewMode('restaurant')}
          >
            By Restaurant
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'drink' ? 'active' : ''}`}
            onClick={() => setViewMode('drink')}
          >
            By Drink
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'user' ? 'active' : ''}`}
            onClick={() => setViewMode('user')}
          >
            By Person
          </button>
        </div>

        <div className="order-stats">
          <span>{currentSession.orders.length} orders</span>
          <span>{currentSession.users.length} members</span>
        </div>
      </div>

      {currentSession.orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">🍹</div>
          <h2>No orders yet</h2>
          <p>Start adding drinks to the session!</p>
        </div>
      ) : (
        <div className="orders-content">
          {viewMode === 'restaurant' ? (
            // Group by restaurant view
            <div className="orders-by-restaurant">
              {Object.entries(ordersByRestaurant).map(([restaurantId, restaurantGroup]) => (
                <div key={restaurantId} className="restaurant-group">
                  <div className="restaurant-group-header">
                    <div className="restaurant-info">
                      <span className="restaurant-icon">🍔</span>
                      <h3>{restaurantGroup.restaurantName}</h3>
                    </div>
                    <div className="restaurant-group-summary">
                      <span className="order-count">{restaurantGroup.orders.length} orders</span>
                      <span className="total-price">${restaurantGroup.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="restaurant-orders">
                    {Object.entries(restaurantGroup.userOrders).map(([userId, userGroup]) => (
                      <div key={userId} className="user-group">
                        <div className="user-group-header">
                          <div className="user-info">
                            <span className="user-icon">👤</span>
                            <span className="user-name">{userGroup.userName}</span>
                          </div>
                          <span className="user-total">${userGroup.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="user-orders">
                          {userGroup.orders.map((order) => (
                            <div key={order.id} className="order-item">
                              <div className="order-details">
                                <span className="order-drink">{order.drinkName}</span>
                                <span className="order-quantity">{order.quantity}x</span>
                                {getCustomizationText(order.customizations) && (
                                  <span className="order-customizations">
                                    {getCustomizationText(order.customizations)}
                                  </span>
                                )}
                              </div>
                              <span className="order-price">${order.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'drink' ? (
            // Group by drink view
            <div className="orders-by-drink">
              {Object.entries(groupedOrders).map(([drinkId, group]) => (
                <div key={drinkId} className="drink-group">
                  <div className="drink-group-header">
                    <h3>{group.drinkName}</h3>
                    <div className="drink-group-summary">
                      <span className="quantity-badge">{group.totalQuantity}x</span>
                      <span className="total-price">${(group.price * group.totalQuantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="drink-orders">
                    {group.orders.map((order) => (
                      <div key={order.id} className="order-item">
                        <div className="order-details">
                          <span className="order-user">{order.userName}</span>
                          <span className="order-quantity">{order.quantity}x</span>
                          {getCustomizationText(order.customizations) && (
                            <span className="order-customizations">
                              {getCustomizationText(order.customizations)}
                            </span>
                          )}
                        </div>
                        <span className="order-price">${order.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Group by user view
            <div className="orders-by-user">
              {Object.entries(ordersByUser).map(([userId, userGroup]) => (
                <div key={userId} className="user-group">
                  <div className="user-group-header">
                    <h3>{userGroup.userName}</h3>
                    <div className="user-group-summary">
                      <span className="order-count">{userGroup.orders.length} items</span>
                      <span className="total-price">${userGroup.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="user-orders">
                    {userGroup.orders.map((order) => (
                      <div key={order.id} className="order-item">
                        <div className="order-details">
                          <span className="order-drink">{order.drinkName}</span>
                          <span className="order-quantity">{order.quantity}x</span>
                          {getCustomizationText(order.customizations) && (
                            <span className="order-customizations">
                              {getCustomizationText(order.customizations)}
                            </span>
                          )}
                        </div>
                        <span className="order-price">${order.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="orders-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Total Items:</span>
                  <span>{currentSession.orders.reduce((sum, order) => sum + order.quantity, 0)}</span>
                </div>
                <div className="summary-row">
                  <span>Total Amount:</span>
                  <span className="total-amount">${currentSession.totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Per Person:</span>
                  <span>${(currentSession.totalAmount / currentSession.users.length).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreator && (
        <div className="session-actions">
          <button 
            className="close-session-btn"
            onClick={() => setShowCloseConfirm(true)}
          >
            Close Session
          </button>
        </div>
      )}

      {showCloseConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Close Session?</h3>
            <p>This will end the session for all members. This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowCloseConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleCloseSession}
              >
                Close Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}