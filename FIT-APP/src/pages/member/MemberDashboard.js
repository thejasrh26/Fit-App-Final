import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import MainLayout from "../../layouts/MainLayout";
import "./MemberDashboard.css";

export default function MemberDashboard() {
  const navigate = useNavigate();
  const { userRole, loading } = useRole();
  const [workouts, setWorkouts] = useState([
    { id: 1, name: "Chest & Triceps", trainer: "John Doe", completed: 8 },
    { id: 2, name: "Back & Biceps", trainer: "Jane Smith", completed: 12 }
  ]);

  if (loading) return <div>Loading...</div>;
  if (userRole !== "member") return <div>Access Denied</div>;

  return (
    <MainLayout>
      <div className="dashboard-container member-dashboard">
        <div className="dashboard-header">
          <h1>👤 Member Dashboard</h1>
          <p>Track Your Fitness Journey</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <h3>Workouts Completed</h3>
              <p className="stat-value">42</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3>Calories Burned</h3>
              <p className="stat-value">12,450</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⬇️</div>
            <div className="stat-content">
              <h3>Weight Lost</h3>
              <p className="stat-value">8.5 kg</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Goal Progress</h3>
              <p className="stat-value">68%</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="section-card">
            <h2>💪 View My Workouts</h2>
            <p>Access your assigned workout plans</p>
            <button className="action-btn" onClick={() => navigate("/member/workouts")}>Start Workout</button>
          </div>

          <div className="section-card">
            <h2>📈 Track Progress</h2>
            <p>Monitor your fitness metrics and improvements</p>
            <button className="action-btn" onClick={() => navigate("/member/progress")}>View Progress</button>
          </div>

          <div className="section-card">
            <h2>📅 Book Sessions</h2>
            <p>Schedule one-on-one training sessions</p>
            <button className="action-btn" onClick={() => navigate("/member/sessions")}>Book Now</button>
          </div>

          <div className="section-card">
            <h2>💬 Diet Plan</h2>
            <p>Get advice and support for your diet</p>
            <button className="action-btn" onClick={() => navigate("/member/diet")}>View Diet Plan</button>
          </div>
        </div>

        {/* Quick Workout List */}
        <div className="workouts-section">
          <h2>📋 Your Active Workouts</h2>
          <div className="workouts-list">
            {workouts.map(workout => (
              <div key={workout.id} className="workout-item">
                <div className="workout-info">
                  <h3>{workout.name}</h3>
                  <p>Trainer: {workout.trainer}</p>
                </div>
                <div className="workout-stats">
                  <span className="completed">{workout.completed} sessions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
