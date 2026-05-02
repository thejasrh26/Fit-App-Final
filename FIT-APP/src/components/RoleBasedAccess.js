import React from "react";
import { useRole } from "../context/RoleContext";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "../utils/roleConfig";

/**
 * RoleBasedAccess Component
 * Conditionally renders content based on user role and permissions
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content to render if user has access
 * @param {string} props.role - Single role to check
 * @param {string[]} props.roles - Array of roles to check (OR condition)
 * @param {string} props.permission - Single permission to check
 * @param {string[]} props.permissions - Array of permissions to check (AND condition - must have all)
 * @param {string[]} props.anyPermission - Array of permissions (OR condition - must have any)
 * @param {React.ReactNode} props.fallback - Content to render if user doesn't have access
 * @returns {React.ReactNode} - Children or fallback
 */
export default function RoleBasedAccess({
  children,
  role,
  roles,
  permission,
  permissions,
  anyPermission,
  fallback = null
}) {
  const { userRole, loading } = useRole();

  if (loading) {
    return null;
  }

  if (!userRole) {
    return fallback;
  }

  // Check single role
  if (role) {
    const hasAccess = userRole === role;
    return hasAccess ? children : fallback;
  }

  // Check multiple roles (OR condition)
  if (roles) {
    const hasAccess = roles.includes(userRole);
    return hasAccess ? children : fallback;
  }

  // Check single permission
  if (permission) {
    const hasAccess = hasPermission(userRole, permission);
    return hasAccess ? children : fallback;
  }

  // Check multiple permissions (AND condition - must have all)
  if (permissions) {
    const hasAccess = hasAllPermissions(userRole, permissions);
    return hasAccess ? children : fallback;
  }

  // Check any permission (OR condition - must have at least one)
  if (anyPermission) {
    const hasAccess = hasAnyPermission(userRole, anyPermission);
    return hasAccess ? children : fallback;
  }

  return children;
}
