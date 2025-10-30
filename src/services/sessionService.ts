import { 
  Session, 
  SessionUser, 
  SessionOrder, 
  SessionCreateRequest, 
  SessionJoinRequest, 
  SessionResponse, 
  AddOrderRequest,
  AddRestaurantOrderRequest,
  DrinkOrder,
  Restaurant
} from '../types';
import { singaporeDrinks } from '../data/drinks';

// File-based session database for persistence
interface SessionDatabase {
  sessions: { [key: string]: Session };
  lastUpdated: string;
}

// Persistent file-based storage for sessions
class SessionStorage {
  private sessions: Map<string, Session> = new Map();
  private dbFilePath = '/src/data/sessions-db.json';

  constructor() {
    // Load existing sessions from file
    this.loadSessionsFromFile();
    // Create demo sessions if none exist
    if (this.sessions.size === 0) {
      this.createDemoSessions();
    }
  }

  // Load sessions from file
  private loadSessionsFromFile() {
    try {
      // In a real app, you'd use fs.readFileSync or fetch
      // For browser compatibility, we'll use localStorage as fallback
      const savedSessions = localStorage.getItem('sessions_db');
      if (savedSessions) {
        const db: SessionDatabase = JSON.parse(savedSessions);
        Object.entries(db.sessions).forEach(([id, session]) => {
          // Convert date strings back to Date objects
          session.createdAt = new Date(session.createdAt);
          session.users = session.users.map(user => ({
            ...user,
            joinedAt: new Date(user.joinedAt)
          }));
          session.orders = session.orders.map(order => ({
            ...order,
            orderedAt: new Date(order.orderedAt)
          }));
          this.sessions.set(id, session);
        });
        console.log(`✅ Loaded ${this.sessions.size} sessions from storage`);
      }
    } catch (error) {
      console.warn('Could not load sessions from storage:', error);
    }
  }

  // Save sessions to file
  private saveSessionsToFile() {
    try {
      const db: SessionDatabase = {
        sessions: Object.fromEntries(this.sessions),
        lastUpdated: new Date().toISOString()
      };
      // In a real app, you'd use fs.writeFileSync or send to server
      // For browser compatibility, we'll use localStorage
      localStorage.setItem('sessions_db', JSON.stringify(db));
      console.log(`💾 Saved ${this.sessions.size} sessions to storage`);
    } catch (error) {
      console.warn('Could not save sessions to storage:', error);
    }
  }

  // Create demo sessions for testing
  private createDemoSessions() {
    const demoSessions = [
      {
        id: 'DEMO01',
        creatorName: 'Alice',
        users: ['Alice', 'Bob']
      },
      {
        id: 'TEST12',
        creatorName: 'Charlie',
        users: ['Charlie']
      },
      {
        id: '67Q660',
        creatorName: 'David',
        users: ['David', 'Emma']
      }
    ];

    demoSessions.forEach(demo => {
      const creatorId = this.generateUserId();
      const session: Session = {
        id: demo.id,
        creatorId,
        creatorName: demo.creatorName,
        createdAt: new Date(),
        users: demo.users.map((name, index) => ({
          id: index === 0 ? creatorId : this.generateUserId(),
          name,
          joinedAt: new Date()
        })),
        orders: [],
        isActive: true,
        totalAmount: 0
      };
      this.sessions.set(demo.id, session);
    });
    
    // Save demo sessions to persistent storage
    this.saveSessionsToFile();
    console.log('🎮 Created demo sessions:', Array.from(this.sessions.keys()));
  }

  // Generate a random 6-character alphanumeric session ID
  private generateSessionId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // Ensure uniqueness
    if (this.sessions.has(result)) {
      return this.generateSessionId();
    }
    return result;
  }

  // Generate a unique user ID
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Generate a unique order ID
  private generateOrderId(): string {
    return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Create a new session
  createSession(request: SessionCreateRequest): SessionResponse {
    try {
      const sessionId = this.generateSessionId();
      const creatorId = this.generateUserId();
      
      const session: Session = {
        id: sessionId,
        creatorId,
        creatorName: request.creatorName,
        createdAt: new Date(),
        users: [{
          id: creatorId,
          name: request.creatorName,
          joinedAt: new Date()
        }],
        orders: [],
        isActive: true,
        totalAmount: 0
      };

      this.sessions.set(sessionId, session);
      this.saveSessionsToFile(); // 💾 Save to persistent storage

      return {
        success: true,
        session,
        message: `Session ${sessionId} created successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create session'
      };
    }
  }

  // Join an existing session
  joinSession(request: SessionJoinRequest): SessionResponse {
    try {
      const session = this.sessions.get(request.sessionId.toUpperCase());
      
      if (!session) {
        return {
          success: false,
          error: 'Session not found'
        };
      }

      if (!session.isActive) {
        return {
          success: false,
          error: 'Session is no longer active'
        };
      }

      // Check if user is already in session
      const existingUser = session.users.find(user => 
        user.name.toLowerCase() === request.userName.toLowerCase()
      );

      if (existingUser) {
        return {
          success: true,
          session,
          message: 'Welcome back to the session!'
        };
      }

      // Add new user to session
      const newUser: SessionUser = {
        id: this.generateUserId(),
        name: request.userName,
        joinedAt: new Date()
      };

      session.users.push(newUser);
      this.saveSessionsToFile(); // 💾 Save to persistent storage

      return {
        success: true,
        session,
        message: `Successfully joined session ${session.id}`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to join session'
      };
    }
  }

  // Get session orders
  getSession(sessionId: string): SessionResponse {
    try {
      const session = this.sessions.get(sessionId.toUpperCase());
      
      if (!session) {
        return {
          success: false,
          error: 'Session not found'
        };
      }

      return {
        success: true,
        session
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to retrieve session'
      };
    }
  }

  // Add an order to session
  addOrderToSession(request: AddOrderRequest): SessionResponse {
    try {
      const session = this.sessions.get(request.sessionId.toUpperCase());
      
      if (!session) {
        return {
          success: false,
          error: 'Session not found'
        };
      }

      if (!session.isActive) {
        return {
          success: false,
          error: 'Session is no longer active'
        };
      }

      // Find user in session
      const user = session.users.find(u => u.id === request.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found in session'
        };
      }

      // Create new order
      const newOrder: SessionOrder = {
        id: this.generateOrderId(),
        userId: request.userId,
        userName: user.name,
        restaurantId: request.restaurantId,
        restaurantName: request.restaurantName,
        drinkId: request.drinkOrder.drinkId,
        drinkName: request.drinkName,
        customizations: request.drinkOrder.customizations,
        quantity: request.drinkOrder.quantity,
        price: request.totalPrice,
        orderedAt: new Date()
      };

      session.orders.push(newOrder);
      session.totalAmount += request.totalPrice;
      this.saveSessionsToFile(); // 💾 Save to persistent storage

      return {
        success: true,
        session,
        message: 'Order added successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add order to session'
      };
    }
  }

  // Get all active sessions (for debugging/admin)
  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  // Close a session
  closeSession(sessionId: string, userId: string): SessionResponse {
    try {
      const session = this.sessions.get(sessionId.toUpperCase());
      
      if (!session) {
        return {
          success: false,
          error: 'Session not found'
        };
      }

      if (session.creatorId !== userId) {
        return {
          success: false,
          error: 'Only the session creator can close the session'
        };
      }

      session.isActive = false;
      this.saveSessionsToFile(); // 💾 Save to persistent storage

      return {
        success: true,
        session,
        message: 'Session closed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to close session'
      };
    }
  }

  // Add restaurant order with multiple drinks to session
  addRestaurantOrderToSession(request: AddRestaurantOrderRequest): SessionResponse {
    try {
      const session = this.sessions.get(request.sessionId.toUpperCase());
      
      if (!session) {
        return {
          success: false,
          error: 'Session not found'
        };
      }

      if (!session.isActive) {
        return {
          success: false,
          error: 'Session is no longer active'
        };
      }

      // Find user in session
      const user = session.users.find(u => u.id === request.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found in session'
        };
      }

      let totalOrderPrice = 0;

      // Add each drink order
      const newOrders = request.drinkOrders.map(drinkOrder => {
        const drink = singaporeDrinks.find(d => d.id === drinkOrder.drinkId);
        if (!drink) {
          throw new Error(`Drink with ID ${drinkOrder.drinkId} not found`);
        }

        // Calculate price with customizations
        let drinkPrice = drink.price;
        Object.entries(drinkOrder.customizations).forEach(([customizationId, optionId]) => {
          const customization = drink.customizations.find(c => c.id === customizationId);
          const option = customization?.options.find(o => o.id === optionId);
          if (option) {
            drinkPrice += option.priceModifier;
          }
        });

        const totalDrinkPrice = drinkPrice * drinkOrder.quantity;
        totalOrderPrice += totalDrinkPrice;

        return {
          id: this.generateOrderId(),
          userId: request.userId,
          userName: user.name,
          restaurantId: request.restaurant.id,
          restaurantName: request.restaurant.name,
          drinkId: drinkOrder.drinkId,
          drinkName: drink.name,
          customizations: drinkOrder.customizations,
          quantity: drinkOrder.quantity,
          price: totalDrinkPrice,
          orderedAt: new Date()
        };
      });

      // Add all orders to session
      session.orders.push(...newOrders);
      session.totalAmount += totalOrderPrice;
      this.saveSessionsToFile(); // 💾 Save to persistent storage

      return {
        success: true,
        session,
        message: `${newOrders.length} drink order(s) added to session successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add restaurant order to session'
      };
    }
  }
}

// Singleton instance
const sessionStorage = new SessionStorage();

// API-like functions
export const sessionService = {
  // POST /session/create
  createSession: (creatorName: string): Promise<SessionResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sessionStorage.createSession({ creatorName }));
      }, 100); // Simulate API delay
    });
  },

  // POST /session/join
  joinSession: (sessionId: string, userName: string): Promise<SessionResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sessionStorage.joinSession({ sessionId, userName }));
      }, 100);
    });
  },

  // GET /session/{id}
  getSession: (sessionId: string): Promise<SessionResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sessionStorage.getSession(sessionId));
      }, 50);
    });
  },

  // POST /session/{id}/orders
  addOrderToSession: (
    sessionId: string, 
    userId: string, 
    restaurantId: string,
    restaurantName: string,
    drinkOrder: any, 
    drinkName: string, 
    totalPrice: number
  ): Promise<SessionResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sessionStorage.addOrderToSession({
          sessionId,
          userId,
          restaurantId,
          restaurantName,
          drinkOrder,
          drinkName,
          totalPrice
        }));
      }, 100);
    });
  },

  // POST /session/{id}/restaurant-order
  addRestaurantOrderToSession: (
    sessionId: string,
    userId: string,
    restaurant: Restaurant,
    drinkOrders: DrinkOrder[]
  ): Promise<SessionResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sessionStorage.addRestaurantOrderToSession({
          sessionId,
          userId,
          restaurant,
          drinkOrders
        }));
      }, 100);
    });
  },

  // PUT /session/{id}/close
  closeSession: (sessionId: string, userId: string): Promise<SessionResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sessionStorage.closeSession(sessionId, userId));
      }, 100);
    });
  },

  // GET /sessions (for debugging)
  getAllSessions: (): Promise<Session[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sessionStorage.getAllSessions());
      }, 50);
    });
  },

  // GET /sessions/available - Get available session IDs
  getAvailableSessionIds: (): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sessions = sessionStorage.getAllSessions();
        const availableIds = sessions
          .filter(session => session.isActive)
          .map(session => session.id);
        resolve(availableIds);
      }, 50);
    });
  }
};