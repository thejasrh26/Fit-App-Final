import React from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import MainLayout from "../../layouts/MainLayout";
import "./TrainerDashboard.css";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { userRole, loading } = useRole();

  if (loading) return <div>Loading...</div>;
  if (userRole !== "trainer") return <div>Access Denied</div>;

  return (
    <MainLayout>
      <div className="dashboard-container trainer-dashboard">
        <div className="dashboard-header">
          <h1>🏋️ Trainer Dashboard</h1>
          <p>Manage Your Clients & Workouts</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>My Clients</h3>
              <p className="stat-value">24</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <h3>Workouts Created</h3>
              <p className="stat-value">156</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Sessions This Week</h3>
              <p className="stat-value">12</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Avg. Progress</h3>
              <p className="stat-value">+8.5%</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="section-card">
            <h2>💪 Create Workout Plan</h2>
            <p>Design customized workout programs for your clients</p>
            <button className="action-btn" onClick={() => navigate("/trainer/workouts")}>New Workout</button>
          </div>

          <div className="section-card">
            <h2>🍎 Assign Diet Plan</h2>
            <p>Create and assign nutritional plans</p>
            <button className="action-btn" onClick={() => navigate("/trainer/diet-plans")}>New Diet Plan</button>
          </div>

          <div className="section-card">
            <h2>📈 Client Progress</h2>
            <p>Track and analyze your client's progress</p>
            <button className="action-btn" onClick={() => navigate("/trainer/progress")}>View Progress</button>
          </div>

          <div className="section-card">
            <h2>📅 Sessions</h2>
            <p>Manage training sessions</p>
            <button className="action-btn" onClick={() => navigate("/trainer/sessions")}>View Sessions</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
