import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Role-Specific Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import MemberDashboard from "./pages/member/MemberDashboard";

// Shared Pages
import Workouts from "./pages/shared/workouts/Workouts";
import Progress from "./pages/shared/Progress";
import Sessions from "./pages/shared/Sessions";
import Diet from "./pages/shared/Diet";
import Profile from "./pages/shared/Profile";
import Settings from "./pages/shared/Settings";
import TrainersList from "./pages/shared/TrainersList";
import Subscription from "./pages/member/Subscription";

// Components
import { RoleProvider } from "./context/RoleContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Styles
import "./design.css"
import "./dashboard.css"
import "./light-theme.css"

function App() {
  useEffect(() => {
    // Load saved theme on app startup
    const savedTheme = localStorage.getItem('fitapp_theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, []);

  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} 
          />

          {/* Trainer Routes */}
          <Route 
            path="/trainer/dashboard" 
            element={<ProtectedRoute element={<TrainerDashboard />} allowedRoles={["trainer"]} />} 
          />

          {/* Member Routes */}
          <Route 
            path="/member/dashboard" 
            element={<ProtectedRoute element={<MemberDashboard />} allowedRoles={["member"]} />} 
          />
          <Route 
            path="/member/subscription" 
            element={<ProtectedRoute element={<Subscription />} allowedRoles={["member"]} />} 
          />

          {/* Shared Routes - All Authenticated Users */}
          <Route 
            path="/workouts" 
            element={<ProtectedRoute element={<Workouts />} />} 
          />
          <Route 
            path="/progress" 
            element={<ProtectedRoute element={<Progress />} />} 
          />
          <Route 
            path="/sessions" 
            element={<ProtectedRoute element={<Sessions />} />} 
          />
          <Route 
            path="/diet" 
            element={<ProtectedRoute element={<Diet />} />} 
          />

          {/* Role-Specific Shared Routes */}
          <Route 
            path="/admin/workouts" 
            element={<ProtectedRoute element={<Workouts />} allowedRoles={["admin", "trainer"]} />} 
          />
          <Route 
            path="/trainer/workouts" 
            element={<ProtectedRoute element={<Workouts />} allowedRoles={["trainer"]} />} 
          />
          <Route 
            path="/member/workouts" 
            element={<ProtectedRoute element={<Workouts />} allowedRoles={["member"]} />} 
          />

          <Route 
            path="/trainer/diet-plans" 
            element={<ProtectedRoute element={<Diet />} allowedRoles={["trainer", "admin"]} />} 
          />
          <Route 
            path="/member/diet" 
            element={<ProtectedRoute element={<Diet />} allowedRoles={["member"]} />} 
          />

          <Route 
            path="/trainer/progress" 
            element={<ProtectedRoute element={<Progress />} allowedRoles={["trainer", "admin"]} />} 
          />
          <Route 
            path="/member/progress" 
            element={<ProtectedRoute element={<Progress />} allowedRoles={["member"]} />} 
          />

          <Route 
            path="/trainer/sessions" 
            element={<ProtectedRoute element={<Sessions />} allowedRoles={["trainer"]} />} 
          />
          <Route 
            path="/member/sessions" 
            element={<ProtectedRoute element={<Sessions />} allowedRoles={["member"]} />} 
          />

          <Route 
            path="/member/trainers" 
            element={<ProtectedRoute element={<TrainersList />} allowedRoles={["member"]} />} 
          />
          <Route 
            path="/member/profile" 
            element={<ProtectedRoute element={<Profile />} allowedRoles={["member"]} />} 
          />
          <Route 
            path="/member/settings" 
            element={<ProtectedRoute element={<Settings />} allowedRoles={["member"]} />} 
          />

          {/* Catch-all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;