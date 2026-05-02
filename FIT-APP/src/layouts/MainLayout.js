import React, { useState } from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { ROLE_CONFIG, MENU_ITEMS } from "../utils/roleConfig";
import AIChatbox from "../components/AIChatbox";
import "./MainLayout.css";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, loading } = useRole();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  const user = auth.currentUser;
  const roleConfig = ROLE_CONFIG[userRole];
  const menuItems = MENU_ITEMS[userRole] || [];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="main-layout">
      {/* Mobile Menu Toggle */}
      <button 
        className="menu-toggle" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h1 className="app-logo">🏋️ FitTrack</h1>
          <p className="role-badge" style={{ backgroundColor: roleConfig.color }}>
            {roleConfig.emoji} {roleConfig.label}
          </p>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu-list">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                  style={isActive(item.path) ? { borderLeftColor: roleConfig.color } : {}}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-email">{user?.email}</p>
            <p className="user-role">{roleConfig.name}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* AI Fitness Assistant Chatbox */}
      <AIChatbox />
    </div>
  );
}
