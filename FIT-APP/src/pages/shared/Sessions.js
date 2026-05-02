import React, { useState } from "react";
import { useRole } from "../../context/RoleContext";
import MainLayout from "../../layouts/MainLayout";
import RoleBasedAccess from "../../components/RoleBasedAccess";
import "./Sessions.css";

export default function Sessions() {
  const { userRole, loading } = useRole();
  const [sessions, setSession] = useState([
    {
      id: 1,
      trainer: "John Doe",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "confirmed"
    },
    {
      id: 2,
      trainer: "Jane Smith",
      date: "2024-01-17",
      time: "2:00 PM",
      status: "pending"
    }
  ]);

  if (loading) return <div>Loading...</div>;

  return (
    <MainLayout>
      <div className="sessions-page">
        <div className="page-header">
          <h1>📅 Training Sessions</h1>
          <p>Book and manage your training sessions</p>
        </div>

        {/* Members: Book Sessions */}
        <RoleBasedAccess roles={["member"]}>
          <div className="book-session-section">
            <h2>Book a Session</h2>
            <form className="book-form">
              <div className="form-group">
                <label>Select Trainer</label>
                <select>
                  <option>John Doe - Strength</option>
                  <option>Jane Smith - Cardio</option>
                  <option>Mike Johnson - Yoga</option>
                </select>
              </div>
              <div className="form-group">
                <label>Select Date</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Select Time</label>
                <select>
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>2:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">Book Session</button>
            </form>
          </div>
        </RoleBasedAccess>

        {/* Trainers: View Scheduled Sessions */}
        <RoleBasedAccess roles={["trainer"]}>
          <div className="trainer-sessions">
            <h2>My Scheduled Sessions</h2>
            <div className="sessions-list">
              {sessions.map(session => (
                <div key={session.id} className="session-item trainer-view">
                  <div className="session-info">
                    <h4>{session.trainer}</h4>
                    <p>{session.date} at {session.time}</p>
                  </div>
                  <div className="session-actions">
                    <button className="action-btn confirm">Confirm</button>
                    <button className="action-btn cancel">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RoleBasedAccess>

        {/* All Roles: Upcoming Sessions */}
        <div className="upcoming-section">
          <h2>Your Upcoming Sessions</h2>
          <div className="sessions-list">
            {sessions.map(session => (
              <div key={session.id} className="session-item">
                <div className="session-info">
                  <h4>{session.trainer}</h4>
                  <p>{session.date} at {session.time}</p>
                </div>
                <div className={`status-badge ${session.status}`}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
