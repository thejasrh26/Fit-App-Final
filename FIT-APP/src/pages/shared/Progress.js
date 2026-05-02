import React from "react";
import { useRole } from "../../context/RoleContext";
import MainLayout from "../../layouts/MainLayout";
import RoleBasedAccess from "../../components/RoleBasedAccess";
import "./Progress.css";

export default function Progress() {
  const { userRole, loading } = useRole();

  if (loading) return <div>Loading...</div>;

  return (
    <MainLayout>
      <div className="progress-page">
        <div className="page-header">
          <h1>📈 Progress Tracking</h1>
          <p>Monitor your fitness journey</p>
        </div>

        <div className="progress-overview">
          <div className="progress-card">
            <h3>Weight Progress</h3>
            <div className="progress-chart">
              <div className="chart-placeholder">📊 Chart Coming Soon</div>
            </div>
            <p className="progress-stat">Lost 8.5 kg in 3 months</p>
          </div>

          <div className="progress-card">
            <h3>Workout Frequency</h3>
            <div className="progress-chart">
              <div className="chart-placeholder">📊 Chart Coming Soon</div>
            </div>
            <p className="progress-stat">24 workouts completed</p>
          </div>

          <div className="progress-card">
            <h3>Calories Burned</h3>
            <div className="progress-chart">
              <div className="chart-placeholder">📊 Chart Coming Soon</div>
            </div>
            <p className="progress-stat">Total: 45,320 cal</p>
          </div>

          <div className="progress-card">
            <h3>Goal Achievement</h3>
            <div className="progress-chart">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "68%" }}></div>
              </div>
            </div>
            <p className="progress-stat">68% Complete</p>
          </div>
        </div>

        {/* Trainer & Admin: View Client Progress */}
        <RoleBasedAccess roles={["trainer", "admin"]}>
          <div className="client-progress-section">
            <h2>Client Progress Reports</h2>
            <div className="client-list">
              <div className="client-item">
                <div className="client-info">
                  <h4>John Smith</h4>
                  <p>Weight: 82kg → 74kg (-8kg)</p>
                </div>
                <button className="view-btn">View Details</button>
              </div>
              <div className="client-item">
                <div className="client-info">
                  <h4>Sarah Johnson</h4>
                  <p>Weight: 68kg → 62kg (-6kg)</p>
                </div>
                <button className="view-btn">View Details</button>
              </div>
            </div>
          </div>
        </RoleBasedAccess>
      </div>
    </MainLayout>
  );
}
