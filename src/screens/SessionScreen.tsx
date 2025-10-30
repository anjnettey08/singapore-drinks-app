import React, { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import './SessionScreen.css';

interface SessionScreenProps {
  onNavigateToOrders: () => void;
  onNavigateToBack: () => void;
}

export default function SessionScreen({ onNavigateToOrders, onNavigateToBack }: SessionScreenProps) {
  const { 
    createSession, 
    joinSession, 
    currentSession, 
    currentUser, 
    isInSession, 
    loading, 
    error, 
    clearError 
  } = useSession();

  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [creatorName, setCreatorName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName.trim()) return;

    const response = await createSession(creatorName.trim());
    if (response.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId.trim() || !userName.trim()) return;

    const response = await joinSession(sessionId.trim().toUpperCase(), userName.trim());
    if (response.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // If already in a session, show session info
  if (isInSession && currentSession && currentUser) {
    return (
      <div className="session-screen">
        <div className="session-header">
          <button className="back-btn" onClick={onNavigateToBack}>
            ← Back
          </button>
          <h1>Session Active</h1>
        </div>

        <div className="session-info-card">
          <div className="session-id-display">
            <h2>Session ID: {currentSession.id}</h2>
            <p className="session-id-subtitle">Share this ID with friends to let them join!</p>
          </div>

          <div className="session-details">
            <div className="session-detail">
              <span className="label">Created by:</span>
              <span className="value">{currentSession.creatorName}</span>
            </div>
            <div className="session-detail">
              <span className="label">Your name:</span>
              <span className="value">{currentUser.name}</span>
            </div>
            <div className="session-detail">
              <span className="label">Total members:</span>
              <span className="value">{currentSession.users.length}</span>
            </div>
            <div className="session-detail">
              <span className="label">Total orders:</span>
              <span className="value">{currentSession.orders.length}</span>
            </div>
            <div className="session-detail">
              <span className="label">Total amount:</span>
              <span className="value">${currentSession.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="session-members">
            <h3>Members ({currentSession.users.length})</h3>
            <div className="members-list">
              {currentSession.users.map((user) => (
                <div key={user.id} className="member-item">
                  <span className="member-name">{user.name}</span>
                  {user.id === currentSession.creatorId && (
                    <span className="creator-badge">Creator</span>
                  )}
                  <span className="member-joined">
                    Joined {new Date(user.joinedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="session-actions">
            <button 
              className="view-orders-btn"
              onClick={onNavigateToOrders}
            >
              View All Orders ({currentSession.orders.length})
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="session-screen">
      <div className="session-header">
        <button className="back-btn" onClick={onNavigateToBack}>
          ← Back
        </button>
        <h1>Group Ordering</h1>
        <p>Create or join a session to order drinks together!</p>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={clearError} className="close-error">×</button>
        </div>
      )}

      {showSuccess && (
        <div className="success-message">
          <span>✓ Success! You're now in a session.</span>
        </div>
      )}

      <div className="session-tabs">
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Session
        </button>
        <button 
          className={`tab-btn ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => setActiveTab('join')}
        >
          Join Session
        </button>
      </div>

      <div className="session-content">
        {activeTab === 'create' ? (
          <form onSubmit={handleCreateSession} className="session-form">
            <h2>Create New Session</h2>
            <p>Start a group order and invite friends to join!</p>
            
            <div className="form-group">
              <label htmlFor="creatorName">Your Name</label>
              <input
                type="text"
                id="creatorName"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="create-btn" disabled={loading || !creatorName.trim()}>
              {loading ? 'Creating...' : 'Create Session'}
            </button>

            <div className="info-box">
              <h4>How it works:</h4>
              <ul>
                <li>Create a session with your name</li>
                <li>Share the 6-digit session ID with friends</li>
                <li>Everyone can add their drink orders</li>
                <li>View consolidated orders for easy group pickup</li>
              </ul>
            </div>
          </form>
        ) : (
          <form onSubmit={handleJoinSession} className="session-form">
            <h2>Join Existing Session</h2>
            <p>Enter a session ID to join a group order!</p>
            
            <div className="form-group">
              <label htmlFor="sessionId">Session ID</label>
              <input
                type="text"
                id="sessionId"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit session ID (e.g., ABC123)"
                maxLength={6}
                required
                disabled={loading}
                style={{ textTransform: 'uppercase' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="userName">Your Name</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="join-btn" 
              disabled={loading || !sessionId.trim() || !userName.trim()}
            >
              {loading ? 'Joining...' : 'Join Session'}
            </button>

            <div className="info-box">
              <h4>Need a session ID?</h4>
              <p>Ask the person who created the session for the 6-character session ID. It looks like "ABC123".</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}