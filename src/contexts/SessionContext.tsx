import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Session, SessionUser, SessionResponse } from '../types';
import { sessionService } from '../services/sessionService';

// Session state interface
interface SessionState {
  currentSession: Session | null;
  currentUser: SessionUser | null;
  isInSession: boolean;
  loading: boolean;
  error: string | null;
}

// Action types
type SessionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SESSION'; payload: { session: Session; user: SessionUser } }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'LEAVE_SESSION' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: SessionState = {
  currentSession: null,
  currentUser: null,
  isInSession: false,
  loading: false,
  error: null,
};

// Reducer
function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_SESSION':
      return {
        ...state,
        currentSession: action.payload.session,
        currentUser: action.payload.user,
        isInSession: true,
        loading: false,
        error: null,
      };
    
    case 'UPDATE_SESSION':
      return {
        ...state,
        currentSession: action.payload,
        loading: false,
      };
    
    case 'LEAVE_SESSION':
      return {
        ...state,
        currentSession: null,
        currentUser: null,
        isInSession: false,
        loading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// Context type
interface SessionContextType {
  // State
  currentSession: Session | null;
  currentUser: SessionUser | null;
  isInSession: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  createSession: (creatorName: string) => Promise<SessionResponse>;
  joinSession: (sessionId: string, userName: string) => Promise<SessionResponse>;
  leaveSession: () => void;
  refreshSession: () => Promise<void>;
  addOrderToSession: (drinkOrder: any, drinkName: string, totalPrice: number) => Promise<SessionResponse>;
  closeSession: () => Promise<SessionResponse>;
  clearError: () => void;
}

// Create context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Export context for direct use if needed
export { SessionContext };

// Provider component
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('currentSession');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedSession && savedUser) {
      try {
        const session = JSON.parse(savedSession);
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_SESSION', payload: { session, user } });
        
        // Refresh session data
        refreshSessionData(session.id);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('currentSession');
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Save session to localStorage
  const saveSessionToStorage = (session: Session, user: SessionUser) => {
    localStorage.setItem('currentSession', JSON.stringify(session));
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  // Clear session from localStorage
  const clearSessionFromStorage = () => {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('currentUser');
  };

  // Refresh session data from server
  const refreshSessionData = async (sessionId: string) => {
    try {
      const response = await sessionService.getSession(sessionId);
      if (response.success && response.session) {
        dispatch({ type: 'UPDATE_SESSION', payload: response.session });
        
        // Update localStorage
        if (state.currentUser) {
          saveSessionToStorage(response.session, state.currentUser);
        }
      } else {
        // Session no longer exists
        dispatch({ type: 'SET_ERROR', payload: 'Session no longer exists' });
        leaveSession();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh session' });
    }
  };

  // Create a new session
  const createSession = async (creatorName: string): Promise<SessionResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await sessionService.createSession(creatorName);
      
      if (response.success && response.session) {
        const creator = response.session.users[0]; // First user is the creator
        dispatch({ type: 'SET_SESSION', payload: { session: response.session, user: creator } });
        saveSessionToStorage(response.session, creator);
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to create session' });
      }
      
      return response;
    } catch (error) {
      const errorMsg = 'Failed to create session';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Join an existing session
  const joinSession = async (sessionId: string, userName: string): Promise<SessionResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await sessionService.joinSession(sessionId, userName);
      
      if (response.success && response.session) {
        // Find the user in the session
        const user = response.session.users.find(u => 
          u.name.toLowerCase() === userName.toLowerCase()
        );
        
        if (user) {
          dispatch({ type: 'SET_SESSION', payload: { session: response.session, user } });
          saveSessionToStorage(response.session, user);
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'User not found in session' });
        }
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to join session' });
      }
      
      return response;
    } catch (error) {
      const errorMsg = 'Failed to join session';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Leave current session
  const leaveSession = () => {
    dispatch({ type: 'LEAVE_SESSION' });
    clearSessionFromStorage();
  };

  // Refresh current session
  const refreshSession = async () => {
    if (state.currentSession) {
      await refreshSessionData(state.currentSession.id);
    }
  };

  // Add order to current session
  const addOrderToSession = async (
    drinkOrder: any, 
    drinkName: string, 
    totalPrice: number
  ): Promise<SessionResponse> => {
    if (!state.currentSession || !state.currentUser) {
      return { success: false, error: 'No active session' };
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await sessionService.addOrderToSession(
        state.currentSession.id,
        state.currentUser.id,
        'legacy-order', // Default restaurant ID for legacy orders
        'Legacy Order', // Default restaurant name for legacy orders
        drinkOrder,
        drinkName,
        totalPrice
      );

      if (response.success && response.session) {
        dispatch({ type: 'UPDATE_SESSION', payload: response.session });
        saveSessionToStorage(response.session, state.currentUser);
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to add order' });
      }

      return response;
    } catch (error) {
      const errorMsg = 'Failed to add order to session';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Close current session (creator only)
  const closeSession = async (): Promise<SessionResponse> => {
    if (!state.currentSession || !state.currentUser) {
      return { success: false, error: 'No active session' };
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await sessionService.closeSession(
        state.currentSession.id,
        state.currentUser.id
      );

      if (response.success) {
        leaveSession();
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to close session' });
      }

      return response;
    } catch (error) {
      const errorMsg = 'Failed to close session';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: SessionContextType = {
    // State
    currentSession: state.currentSession,
    currentUser: state.currentUser,
    isInSession: state.isInSession,
    loading: state.loading,
    error: state.error,
    
    // Actions
    createSession,
    joinSession,
    leaveSession,
    refreshSession,
    addOrderToSession,
    closeSession,
    clearError,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook to use session context
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}