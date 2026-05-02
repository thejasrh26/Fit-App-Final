import React from "react";
import { Navigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { hasPermission } from "../utils/roleConfig";

/**
 * Protected Route Component
 * Restricts access to pages based on user role and permissions
 * 
 * @param {object} props - Component props
 * @param {React.Component} props.element - The component to render
 * @param {string[]} props.allowedRoles - Array of allowed roles
 * @param {string[]} props.requiredPermissions - Array of required permissions
 * @returns {React.Component} - Protected component or redirect
 */
export default function ProtectedRoute({ 
  element, 
  allowedRoles, 
  requiredPermissions 
}) {
  const { userRole, loading } = useRole();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!userRole) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to role-specific dashboard
    const roleDashboards = {
      admin: "/admin/dashboard",
      trainer: "/trainer/dashboard",
      member: "/member/dashboard"
    };
    return <Navigate to={roleDashboards[userRole] || "/login"} replace />;
  }

  // Check if user has required permissions
  if (requiredPermissions) {
    const hasAllPerms = requiredPermissions.every(permission => 
      hasPermission(userRole, permission)
    );
    
    if (!hasAllPerms) {
      const roleDashboards = {
        admin: "/admin/dashboard",
        trainer: "/trainer/dashboard",
        member: "/member/dashboard"
      };
      return <Navigate to={roleDashboards[userRole] || "/login"} replace />;
    }
  }

  return element;
}
