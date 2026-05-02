/**
 * QUICK START GUIDE - Role-Based System Usage Examples
 * 
 * This file demonstrates how to use the role-based access control system
 * in your React components throughout the app.
 */

// ============================================
// 1. GETTING USER ROLE IN A COMPONENT
// ============================================

import { useRole } from "../context/RoleContext";

function MyComponent() {
  const { userRole, loading, saveUserRole } = useRole();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Your current role: {userRole}</p>
      {/* Role is 'admin', 'trainer', or 'member' */}
    </div>
  );
}


// ============================================
// 2. CONDITIONAL RENDERING BY ROLE
// ============================================

import RoleBasedAccess from "../components/RoleBasedAccess";

function Dashboard() {
  return (
    <div>
      {/* Show only to admins */}
      <RoleBasedAccess roles={["admin"]}>
        <AdminPanel />
      </RoleBasedAccess>

      {/* Show to trainers and admins */}
      <RoleBasedAccess roles={["trainer", "admin"]}>
        <TrainerTools />
      </RoleBasedAccess>

      {/* Show to everyone except admin */}
      <RoleBasedAccess roles={["member", "trainer"]}>
        <UserSection />
      </RoleBasedAccess>
    </div>
  );
}


// ============================================
// 3. PERMISSION-BASED RENDERING
// ============================================

import { hasPermission } from "../utils/roleConfig";

function Analytics() {
  const { userRole } = useRole();

  // Show analytics only if user has permission
  return (
    <RoleBasedAccess permission="view_analytics">
      <AnalyticsWidget />
    </RoleBasedAccess>
  );
}


// ============================================
// 4. MULTIPLE PERMISSIONS (ALL REQUIRED)
// ============================================

function AdminTools() {
  return (
    <RoleBasedAccess permissions={["manage_users", "view_analytics"]}>
      <div>
        <UserManagement />
        <AnalyticsDashboard />
      </div>
    </RoleBasedAccess>
  );
}


// ============================================
// 5. ANY PERMISSION (OR CONDITION)
// ============================================

function ReportingFeature() {
  return (
    <RoleBasedAccess anyPermission={["view_analytics", "view_revenue", "view_attendance"]}>
      <ReportsPanel />
    </RoleBasedAccess>
  );
}


// ============================================
// 6. PROTECTED ROUTES
// ============================================

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Only admins can access */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute 
            element={<AdminDashboard />}
            allowedRoles={["admin"]}
          />
        }
      />

      {/* Only trainers and admins can access */}
      <Route 
        path="/training" 
        element={
          <ProtectedRoute 
            element={<TrainingModule />}
            allowedRoles={["trainer", "admin"]}
          />
        }
      />

      {/* Requires specific permission */}
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute 
            element={<Analytics />}
            requiredPermissions={["view_analytics"]}
          />
        }
      />
    </Routes>
  );
}


// ============================================
// 7. PERMISSION CHECKING IN LOGIC
// ============================================

import { hasAllPermissions, hasAnyPermission } from "../utils/roleConfig";

function WorkoutPlanner() {
  const { userRole } = useRole();

  const handleCreatePlan = async () => {
    // Check permission before allowing action
    if (!hasPermission(userRole, "create_workout_plans")) {
      alert("You don't have permission to create plans");
      return;
    }

    // Create workout plan...
  };

  return (
    <button onClick={handleCreatePlan}>
      Create Workout Plan
    </button>
  );
}


// ============================================
// 8. ROLE-SPECIFIC UI ELEMENTS
// ============================================

import { ROLE_CONFIG } from "../utils/roleConfig";

function UserProfile() {
  const { userRole } = useRole();
  const roleConfig = ROLE_CONFIG[userRole];

  return (
    <div>
      <h2>
        <span>{roleConfig?.emoji}</span>
        {roleConfig?.label}
      </h2>
      <p style={{ color: roleConfig?.color }}>
        {roleConfig?.description}
      </p>

      {/* Show role-specific features */}
      <RoleBasedAccess roles={["admin"]}>
        <AdminFeatures />
      </RoleBasedAccess>

      <RoleBasedAccess roles={["trainer"]}>
        <TrainerFeatures />
      </RoleBasedAccess>

      <RoleBasedAccess roles={["member"]}>
        <MemberFeatures />
      </RoleBasedAccess>
    </div>
  );
}


// ============================================
// 9. ROLE SELECTION IN LOGIN/SIGNUP
// ============================================

import RoleToggle from "../components/RoleToggle";

function LoginForm() {
  const [selectedRole, setSelectedRole] = React.useState("member");
  const { saveUserRole } = useRole();

  const handleLogin = async (credentials) => {
    // Login user...
    const user = await loginUser(credentials);

    // Save selected role
    await saveUserRole(user.uid, selectedRole);
  };

  return (
    <form>
      <RoleToggle 
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />
      <input placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </form>
  );
}


// ============================================
// 10. FALLBACK UI FOR UNAUTHORIZED ACCESS
// ============================================

function ProtectedFeature() {
  return (
    <RoleBasedAccess 
      roles={["admin"]}
      fallback={
        <div className="unauthorized">
          <p>⛔ You don't have permission to access this feature</p>
          <p>Contact an administrator for access</p>
        </div>
      }
    >
      <AdminOnlyFeature />
    </RoleBasedAccess>
  );
}


// ============================================
// 11. GETTING ROLE CONFIG
// ============================================

import { getRoleConfig, getAllRoles } from "../utils/roleConfig";

function RoleSelector() {
  const allRoles = getAllRoles();

  return (
    <div>
      {allRoles.map((role) => (
        <div key={role.id}>
          <h3>{role.emoji} {role.name}</h3>
          <p>{role.description}</p>
          <ul>
            {role.responsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}


// ============================================
// 12. CONDITIONAL STYLING BY ROLE
// ============================================

function RoleCard() {
  const { userRole } = useRole();
  const roleConfig = ROLE_CONFIG[userRole];

  const cardStyle = {
    borderColor: roleConfig?.color,
    boxShadow: `0 0 15px ${roleConfig?.color}80`,
    backgroundColor: `${roleConfig?.color}20`
  };

  return (
    <div style={cardStyle} className="role-card">
      <span className="role-emoji">{roleConfig?.emoji}</span>
      <span className="role-label">{roleConfig?.label}</span>
    </div>
  );
}


// ============================================
// EXPORTS & UTILITY SUMMARY
// ============================================

/**
 * useRole() Hook
 * - userRole: Current user's role string
 * - loading: Loading state while fetching role
 * - saveUserRole(uid, role): Save user role to Firestore
 */

/**
 * RoleBasedAccess Component Props
 * - role: Check single role (string)
 * - roles: Check multiple roles (array)
 * - permission: Check single permission (string)
 * - permissions: Check all permissions (array)
 * - anyPermission: Check any permission (array)
 * - children: Content to show if access granted
 * - fallback: Content to show if access denied
 */

/**
 * ProtectedRoute Component Props
 * - element: Component to render
 * - allowedRoles: Array of allowed roles
 * - requiredPermissions: Array of required permissions
 */

/**
 * roleConfig Utilities
 * - hasPermission(userRole, permission): boolean
 * - hasAnyPermission(userRole, permissions[]): boolean
 * - hasAllPermissions(userRole, permissions[]): boolean
 * - getRoleConfig(role): Role configuration object
 * - getAllRoles(): Array of all role configurations
 */

/**
 * ROLE_CONFIG object structure
 * {
 *   id: string,
 *   name: string,
 *   emoji: string,
 *   label: string,
 *   color: string (hex),
 *   permissions: string[],
 *   responsibilities: string[],
 *   description: string
 * }
 */

/**
 * Available Roles
 * - admin: Super Admin with full control
 * - trainer: Coach managing clients
 * - member: End user of the app
 */
