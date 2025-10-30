import React, { useState, useEffect } from 'react';
import { sessionService } from '../services/sessionService';
import { Session } from '../types';
import './SessionBrowser.css';

interface SessionBrowserProps {
  onJoinSession: (sessionId: string) => void;
  onClose: () => void;
}

export default function SessionBrowser({ onJoinSession, onClose }: SessionBrowserProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const allSessions = await sessionService.getAllSessions();
      const activeSessions = allSessions.filter(session => session.isActive);
      setSessions(activeSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-SG', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="session-browser">
        <div className="session-browser-header">
          <h3>Available Sessions</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="loading">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="session-browser">
      <div className="session-browser-header">
        <h3>Available Sessions ({sessions.length})</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {sessions.length === 0 ? (
        <div className="no-sessions">
          <p>No active sessions found.</p>
          <p>Create a new session to get started!</p>
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map((session) => (
            <div key={session.id} className="session-card">
              <div className="session-info">
                <div className="session-id-badge">{session.id}</div>
                <div className="session-details">
                  <div className="session-creator">
                    Created by <strong>{session.creatorName}</strong>
                  </div>
                  <div className="session-meta">
                    <span className="members-count">
                      👥 {session.users.length} member{session.users.length !== 1 ? 's' : ''}
                    </span>
                    <span className="orders-count">
                      🛍️ {session.orders.length} order{session.orders.length !== 1 ? 's' : ''}
                    </span>
                    <span className="created-time">
                      🕒 {formatTime(session.createdAt)}
                    </span>
                  </div>
                  {session.totalAmount > 0 && (
                    <div className="session-total">
                      Total: <strong>${session.totalAmount.toFixed(2)}</strong>
                    </div>
                  )}
                </div>
              </div>
              <button 
                className="join-session-btn"
                onClick={() => onJoinSession(session.id)}
              >
                Join Session
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="session-browser-footer">
        <button className="refresh-btn" onClick={loadSessions}>
          🔄 Refresh
        </button>
        <div className="info-text">
          Sessions are now persistent and shareable!
        </div>
      </div>
    </div>
  );
}