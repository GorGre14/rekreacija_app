'use client';

import { useEffect, useState } from 'react';
import { api, Event, User } from '../lib/api';
import Link from 'next/link';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load events
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: number) => {
    if (!user) return;
    
    try {
      const updatedEvent = await api.joinEvent(eventId);
      setEvents(events.map(e => e.id === eventId ? updatedEvent : e));
    } catch (error) {
      console.error('Failed to join event:', error);
    }
  };

  const handleLeaveEvent = async (eventId: number) => {
    if (!user) return;
    
    try {
      const updatedEvent = await api.leaveEvent(eventId);
      setEvents(events.map(e => e.id === eventId ? updatedEvent : e));
    } catch (error) {
      console.error('Failed to leave event:', error);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <div>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <div className="logo">Recreation Finder</div>
          <div className="nav-links">
            {user ? (
              <>
                <span>Hello, {user.name}!</span>
                <Link href="/create" className="btn">Create Event</Link>
                <button onClick={handleLogout} className="btn">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn">Login</Link>
                <Link href="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>
          Find Your Next Adventure
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center' }}>Loading events...</div>
        ) : (
          <div className="events-grid">
            {events.map((event) => {
              const isAttending = user && event.attendees.includes(user.email);
              const isCreator = user && event.createdBy === user.email;
              
              return (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <div className="event-sport">{event.sport}</div>
                    <div>{event.skillLevel}</div>
                  </div>
                  
                  <div className="event-details">
                    <div>📍 {event.location}</div>
                    <div>📅 {event.date}</div>
                    <div>⏰ {event.time}</div>
                    <div>👥 {event.ageGroup}</div>
                    <div>🎯 {event.attendees.length} attending</div>
                  </div>

                  {user && !isCreator && (
                    <div className="event-actions">
                      {isAttending ? (
                        <button
                          onClick={() => handleLeaveEvent(event.id)}
                          className="btn"
                          style={{ background: 'rgba(239, 68, 68, 0.8)' }}
                        >
                          Leave
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinEvent(event.id)}
                          className="btn btn-primary"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  )}
                  
                  {isCreator && (
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      Your event
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {events.length === 0 && !loading && (
          <div style={{ textAlign: 'center', opacity: 0.8 }}>
            No events found. {user && <Link href="/create" className="btn btn-primary">Create the first one!</Link>}
          </div>
        )}
      </div>
    </div>
  );
}