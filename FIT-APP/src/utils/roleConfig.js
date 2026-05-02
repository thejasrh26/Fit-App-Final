/**
 * Role-based Access Control (RBAC) Configuration
 * Defines roles, permissions, and responsibilities for each user type
 */

export const ROLES = {
  ADMIN: "admin",
  TRAINER: "trainer",
  MEMBER: "member"
};

export const ROLE_CONFIG = {
  admin: {
    id: "admin",
    name: "Admin",
    emoji: "👑",
    label: "Super Admin",
    color: "#FF6B6B",
    permissions: [
      "manage_users",
      "manage_trainers",
      "manage_members",
      "manage_branches",
      "manage_plans",
      "manage_subscriptions",
      "view_analytics",
      "view_revenue",
      "view_attendance",
      "view_engagement",
      "handle_complaints",
      "system_settings",
      "manage_workouts",
      "manage_diets",
      "view_all_data"
    ],
    responsibilities: [
      "Full control of the system",
      "Manage users (trainers + members)",
      "Manage gym branches, plans, subscriptions",
      "View analytics (revenue, attendance, engagement)",
      "Handle complaints & system settings"
    ],
    description: "Backend authority with complete system control"
  },

  trainer: {
    id: "trainer",
    name: "Trainer",
    emoji: "🏋️",
    label: "Coach",
    color: "#4ECDC4",
    permissions: [
      "create_workout_plans",
      "assign_diet_plans",
      "track_progress",
      "schedule_sessions",
      "chat_with_clients",
      "view_assigned_members",
      "upload_content",
      "manage_own_profile",
      "view_own_analytics"
    ],
    responsibilities: [
      "Create workout plans",
      "Assign diet plans",
      "Track member progress",
      "Schedule sessions",
      "Chat with clients"
    ],
    description: "Core role for member engagement and guidance"
  },

  member: {
    id: "member",
    name: "Member",
    emoji: "👤",
    label: "User",
    color: "#95E1D3",
    permissions: [
      "view_workout_plans",
      "view_diet_plans",
      "track_workouts",
      "track_weight",
      "track_progress",
      "book_sessions",
      "make_payments",
      "renew_subscriptions",
      "chat_with_trainers",
      "view_own_data",
      "view_own_progress"
    ],
    responsibilities: [
      "View workout & diet plans",
      "Track workouts, weight, progress",
      "Book sessions with trainers",
      "Make payments / renew subscriptions"
    ],
    description: "Main user base - end users of the app"
  }
};

/**
 * Menu items for each role
 */
export const MENU_ITEMS = {
  admin: [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/trainers", label: "Trainers", icon: "🏋️" },
    { path: "/admin/members", label: "Members", icon: "👤" },
    { path: "/admin/plans", label: "Plans", icon: "📋" },
    { path: "/admin/revenue", label: "Revenue", icon: "💰" },
    { path: "/admin/analytics", label: "Analytics", icon: "📈" },
    { path: "/admin/settings", label: "Settings", icon: "⚙️" }
  ],
  trainer: [
    { path: "/trainer/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/trainer/workouts", label: "Workouts", icon: "💪" },
    { path: "/trainer/diet-plans", label: "Diet Plans", icon: "🍎" },
    { path: "/trainer/clients", label: "My Clients", icon: "👥" },
    { path: "/trainer/sessions", label: "Sessions", icon: "📅" },
    { path: "/trainer/progress", label: "Progress", icon: "📈" },
    { path: "/trainer/messages", label: "Messages", icon: "💬" },
    { path: "/trainer/profile", label: "Profile", icon: "👤" }
  ],
  member: [
    { path: "/member/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/member/workouts", label: "My Workouts", icon: "💪" },
    { path: "/member/diet", label: "Diet Plans", icon: "🍎" },
    { path: "/member/progress", label: "Progress", icon: "📈" },
    { path: "/member/sessions", label: "Book Sessions", icon: "📅" },
    { path: "/member/subscription", label: "Membership", icon: "💳" },
    { path: "/member/trainers", label: "Trainers", icon: "👥" },
    { path: "/member/profile", label: "Profile", icon: "👤" },
    { path: "/member/settings", label: "Settings", icon: "⚙️" }
  ]
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean} - Whether the user has the permission
 */
export const hasPermission = (userRole, permission) => {
  const roleConfig = ROLE_CONFIG[userRole];
  return roleConfig && roleConfig.permissions.includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 * @param {string} userRole - The user's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether the user has any permission
 */
export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if a user has all of the specified permissions
 * @param {string} userRole - The user's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether the user has all permissions
 */
export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Get role configuration
 * @param {string} role - The role ID
 * @returns {object} - The role configuration
 */
export const getRoleConfig = (role) => {
  return ROLE_CONFIG[role] || null;
};

/**
 * Get all available roles
 * @returns {object[]} - Array of role configurations
 */
export const getAllRoles = () => {
  return Object.values(ROLE_CONFIG);
};
