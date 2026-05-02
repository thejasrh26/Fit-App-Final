import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import { ROLE_CONFIG } from "../../utils/roleConfig";
import MainLayout from "../../layouts/MainLayout";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { userRole, loading } = useRole();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMembers: 0,
    totalTrainers: 0,
    revenue: 0
  });

  if (loading) return <div>Loading...</div>;
  if (userRole !== "admin") return <div>Access Denied</div>;

  return (
    <MainLayout>
      <div className="dashboard-container admin-dashboard">
        <div className="dashboard-header">
          <h1>👑 Admin Dashboard</h1>
          <p>System Overview & Management</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-value">1,234</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <h3>Members</h3>
              <p className="stat-value">980</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏋️</div>
            <div className="stat-content">
              <h3>Trainers</h3>
              <p className="stat-value">42</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Revenue</h3>
              <p className="stat-value">$45,320</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="section-card">
            <h2>📊 Analytics</h2>
            <p>View system analytics, reports, and engagement metrics</p>
            <button className="action-btn" onClick={() => alert("Analytics coming soon!")}>View Analytics</button>
          </div>

          <div className="section-card">
            <h2>⚙️ System Settings</h2>
            <p>Configure app settings, billing, and preferences</p>
            <button className="action-btn" onClick={() => alert("Settings coming soon!")}>Manage Settings</button>
          </div>

          <div className="section-card">
            <h2>📋 Workouts & Plans</h2>
            <p>Manage global workout plans</p>
            <button className="action-btn" onClick={() => navigate("/admin/workouts")}>Manage Plans</button>
          </div>

          <div className="section-card">
            <h2>🔔 Support</h2>
            <p>Handle complaints and support tickets</p>
            <button className="action-btn" onClick={() => alert("Support coming soon!")}>View Tickets</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
