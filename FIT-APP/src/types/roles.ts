/**
 * TypeScript Type Definitions for Role-Based System
 * 
 * If you plan to migrate to TypeScript or use JSDoc type hints,
 * you can use these definitions.
 */

// ============================================
// Role Types
// ============================================

/**
 * User role type
 */
export type UserRole = 'admin' | 'trainer' | 'member';

/**
 * Permission type
 */
export type Permission = 
  | 'manage_users'
  | 'manage_trainers'
  | 'manage_members'
  | 'manage_branches'
  | 'manage_plans'
  | 'manage_subscriptions'
  | 'view_analytics'
  | 'view_revenue'
  | 'view_attendance'
  | 'view_engagement'
  | 'handle_complaints'
  | 'system_settings'
  | 'manage_workouts'
  | 'manage_diets'
  | 'view_all_data'
  | 'create_workout_plans'
  | 'assign_diet_plans'
  | 'track_progress'
  | 'schedule_sessions'
  | 'chat_with_clients'
  | 'view_assigned_members'
  | 'upload_content'
  | 'manage_own_profile'
  | 'view_own_analytics'
  | 'view_workout_plans'
  | 'view_diet_plans'
  | 'track_workouts'
  | 'track_weight'
  | 'book_sessions'
  | 'make_payments'
  | 'renew_subscriptions'
  | 'chat_with_trainers'
  | 'view_own_data'
  | 'view_own_progress';

// ============================================
// Role Configuration
// ============================================

/**
 * Role configuration interface
 */
export interface RoleConfig {
  id: UserRole;
  name: string;
  emoji: string;
  label: string;
  color: string;
  permissions: Permission[];
  responsibilities: string[];
  description: string;
}

/**
 * Role configuration map
 */
export interface RoleConfigMap {
  admin: RoleConfig;
  trainer: RoleConfig;
  member: RoleConfig;
}

// ============================================
// User Types
// ============================================

/**
 * User document in Firestore
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
}

/**
 * User record for Firestore
 */
export interface UserFirestoreRecord {
  role: UserRole;
  createdAt: Date;
  email?: string;
  displayName?: string;
}

// ============================================
// Context Types
// ============================================

/**
 * RoleContext value type
 */
export interface RoleContextValue {
  userRole: UserRole | null;
  loading: boolean;
  saveUserRole: (uid: string, role: UserRole) => Promise<void>;
}

// ============================================
// Component Props
// ============================================

/**
 * RoleToggle component props
 */
export interface RoleToggleProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

/**
 * RoleBasedAccess component props
 */
export interface RoleBasedAccessProps {
  children: React.ReactNode;
  role?: UserRole;
  roles?: UserRole[];
  permission?: Permission;
  permissions?: Permission[];
  anyPermission?: Permission[];
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute component props
 */
export interface ProtectedRouteProps {
  element: React.ReactElement;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
}

// ============================================
// Utility Function Types
// ============================================

/**
 * Check if user has a specific permission
 */
export type HasPermission = (
  userRole: UserRole,
  permission: Permission
) => boolean;

/**
 * Check if user has any of the specified permissions
 */
export type HasAnyPermission = (
  userRole: UserRole,
  permissions: Permission[]
) => boolean;

/**
 * Check if user has all of the specified permissions
 */
export type HasAllPermissions = (
  userRole: UserRole,
  permissions: Permission[]
) => boolean;

/**
 * Get role configuration
 */
export type GetRoleConfig = (role: UserRole) => RoleConfig | null;

/**
 * Get all available roles
 */
export type GetAllRoles = () => RoleConfig[];

// ============================================
// API Request/Response Types
// ============================================

/**
 * Save user role request body
 */
export interface SaveUserRoleRequest {
  uid: string;
  role: UserRole;
}

/**
 * Save user role response
 */
export interface SaveUserRoleResponse {
  success: boolean;
  message: string;
  user?: User;
}

/**
 * Get user role request params
 */
export interface GetUserRoleRequest {
  uid: string;
}

/**
 * Get user role response
 */
export interface GetUserRoleResponse {
  role: UserRole;
  user: User;
}

// ============================================
// Dashboard Types
// ============================================

/**
 * Dashboard metrics for admin
 */
export interface AdminMetrics {
  totalUsers: number;
  revenue: number;
  activeMembers: number;
  branches: number;
}

/**
 * Dashboard metrics for trainer
 */
export interface TrainerMetrics {
  assignedClients: number;
  activePlans: number;
  scheduledSessions: number;
  progressTracked: number;
}

/**
 * Dashboard metrics for member
 */
export interface MemberMetrics {
  totalWorkouts: number;
  caloriesBurned: number;
  duration: number;
  streak: number;
}

// ============================================
// Audit Log Types
// ============================================

/**
 * Audit log entry
 */
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit log actions
 */
export enum AuditAction {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_CREATED = 'USER_CREATED',
  USER_DELETED = 'USER_DELETED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_UPDATED = 'USER_UPDATED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SENSITIVE_ACTION = 'SENSITIVE_ACTION'
}

// ============================================
// Hook Return Types
// ============================================

/**
 * useRole hook return type
 */
export interface UseRoleReturn {
  userRole: UserRole | null;
  loading: boolean;
  saveUserRole: (uid: string, role: UserRole) => Promise<void>;
}

// ============================================
// Error Types
// ============================================

/**
 * Role-based access error
 */
export class RoleAccessError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'RoleAccessError';
  }
}

/**
 * Permission denied error
 */
export class PermissionDeniedError extends RoleAccessError {
  constructor(message = 'Permission denied') {
    super('PERMISSION_DENIED', message);
  }
}

/**
 * Role not found error
 */
export class RoleNotFoundError extends RoleAccessError {
  constructor(role: string) {
    super('ROLE_NOT_FOUND', `Role not found: ${role}`);
  }
}

// ============================================
// Firestore Collection Types
// ============================================

/**
 * Firestore collections structure
 */
export interface FirestoreCollections {
  users: {
    [uid: string]: UserFirestoreRecord;
  };
  audit_logs: {
    [id: string]: AuditLog;
  };
  workouts?: {
    [id: string]: any;
  };
  memberships?: {
    [id: string]: any;
  };
}

// ============================================
// Custom Type Guards
// ============================================

/**
 * Type guard to check if value is a valid UserRole
 */
export const isUserRole = (value: any): value is UserRole => {
  return ['admin', 'trainer', 'member'].includes(value);
};

/**
 * Type guard to check if value is a valid Permission
 */
export const isPermission = (value: any): value is Permission => {
  const validPermissions: Permission[] = [
    'manage_users',
    'manage_trainers',
    'manage_members',
    'manage_branches',
    'manage_plans',
    'manage_subscriptions',
    'view_analytics',
    'view_revenue',
    'view_attendance',
    'view_engagement',
    'handle_complaints',
    'system_settings',
    'manage_workouts',
    'manage_diets',
    'view_all_data',
    'create_workout_plans',
    'assign_diet_plans',
    'track_progress',
    'schedule_sessions',
    'chat_with_clients',
    'view_assigned_members',
    'upload_content',
    'manage_own_profile',
    'view_own_analytics',
    'view_workout_plans',
    'view_diet_plans',
    'track_workouts',
    'track_weight',
    'book_sessions',
    'make_payments',
    'renew_subscriptions',
    'chat_with_trainers',
    'view_own_data',
    'view_own_progress'
  ];
  return validPermissions.includes(value);
};

/**
 * Type guard to check if object is RoleConfig
 */
export const isRoleConfig = (value: any): value is RoleConfig => {
  return (
    value &&
    typeof value === 'object' &&
    'id' in value &&
    'permissions' in value &&
    'responsibilities' in value &&
    isUserRole(value.id)
  );
};

// ============================================
// Export all types
// ============================================

export type {
  UserRole,
  Permission,
  RoleConfig,
  RoleConfigMap,
  User,
  UserFirestoreRecord,
  RoleContextValue,
  RoleToggleProps,
  RoleBasedAccessProps,
  ProtectedRouteProps,
  HasPermission,
  HasAnyPermission,
  HasAllPermissions,
  GetRoleConfig,
  GetAllRoles,
  SaveUserRoleRequest,
  SaveUserRoleResponse,
  GetUserRoleRequest,
  GetUserRoleResponse,
  AdminMetrics,
  TrainerMetrics,
  MemberMetrics,
  AuditLog,
  UseRoleReturn,
  FirestoreCollections
};
