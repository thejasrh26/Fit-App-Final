const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

/**
 * Verify Firebase ID Token
 * Extracts and verifies the Firebase token from request headers
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized: No token provided' 
      });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (err) {
      return res.status(401).json({ 
        error: 'Unauthorized: Invalid or expired token' 
      });
    }
  } catch (err) {
    return res.status(500).json({ 
      error: 'Authentication error: ' + err.message 
    });
  }
};

/**
 * Verify user role from Firestore
 * Checks if user has the required role
 */
const verifyRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(req.user.uid)
        .get();

      if (!userDoc.exists) {
        return res.status(403).json({ 
          error: 'Forbidden: User role not found' 
        });
      }

      const userRole = userDoc.data().role;

      if (!allowedRoles.includes(userRole)) {
        // Log failed access attempt
        await logAuditEvent(
          req.user.uid,
          'PERMISSION_DENIED',
          {
            attemptedAction: req.path,
            requiredRoles: allowedRoles,
            userRole: userRole
          }
        );

        return res.status(403).json({ 
          error: 'Forbidden: Insufficient permissions' 
        });
      }

      req.userRole = userRole;
      next();
    } catch (err) {
      return res.status(500).json({ 
        error: 'Error verifying role: ' + err.message 
      });
    }
  };
};

/**
 * Verify specific permission
 */
const verifyPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(req.user.uid)
        .get();

      if (!userDoc.exists) {
        return res.status(403).json({ 
          error: 'Forbidden: User role not found' 
        });
      }

      const userRole = userDoc.data().role;
      const permissions = getRolePermissions(userRole);

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ 
          error: `Forbidden: Missing permission '${requiredPermission}'` 
        });
      }

      req.userRole = userRole;
      next();
    } catch (err) {
      return res.status(500).json({ 
        error: 'Error verifying permission: ' + err.message 
      });
    }
  };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get all permissions for a role
 */
const getRolePermissions = (role) => {
  const rolePermissions = {
    admin: [
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
      'view_all_data'
    ],
    trainer: [
      'create_workout_plans',
      'assign_diet_plans',
      'track_progress',
      'schedule_sessions',
      'chat_with_clients',
      'view_assigned_members',
      'upload_content',
      'manage_own_profile',
      'view_own_analytics'
    ],
    member: [
      'view_workout_plans',
      'view_diet_plans',
      'track_workouts',
      'track_weight',
      'track_progress',
      'book_sessions',
      'make_payments',
      'renew_subscriptions',
      'chat_with_trainers',
      'view_own_data',
      'view_own_progress'
    ]
  };

  return rolePermissions[role] || [];
};

/**
 * Log audit events
 */
const logAuditEvent = async (userId, action, details = {}) => {
  try {
    await admin.firestore().collection('audit_logs').add({
      userId,
      action,
      details,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ipAddress: process.env.CLIENT_IP,
      userAgent: process.env.CLIENT_AGENT
    });
  } catch (err) {
    console.error('Error logging audit event:', err);
  }
};

// ============================================
// PUBLIC ROUTES (No Auth Required)
// ============================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Firebase client SDK handles login, backend just returns success
    res.json({ 
      success: true, 
      message: 'Login successful. Use Firebase client SDK.' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/logout', verifyToken, async (req, res) => {
  try {
    // Log logout event
    await logAuditEvent(req.user.uid, 'USER_LOGOUT');

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// USER ROUTES (Require Authentication)
// ============================================

/**
 * Get current user info
 */
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(req.user.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name,
        ...userDoc.data()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Update user profile
 */
app.put('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const { displayName } = req.body;

    const updateData = {};
    if (displayName) {
      updateData.displayName = displayName;
    }

    await admin
      .firestore()
      .collection('users')
      .doc(req.user.uid)
      .update(updateData);

    res.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// ADMIN ROUTES (Require Admin Role)
// ============================================

/**
 * Get all users (Admin only)
 */
app.get('/api/admin/users', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const usersSnapshot = await admin
      .firestore()
      .collection('users')
      .get();

    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({
        uid: doc.id,
        ...doc.data()
      });
    });

    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get user by ID (Admin only)
 */
app.get('/api/admin/users/:uid', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(req.params.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        uid: userDoc.id,
        ...userDoc.data()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Update user role (Admin only)
 */
app.put('/api/admin/users/:uid/role', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'trainer', 'member'];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be admin, trainer, or member' 
      });
    }

    // Get old role for audit log
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(req.params.uid)
      .get();

    const oldRole = userDoc.data()?.role;

    // Update role
    await admin
      .firestore()
      .collection('users')
      .doc(req.params.uid)
      .update({ role });

    // Log the change
    await logAuditEvent(
      req.user.uid,
      'USER_ROLE_CHANGED',
      {
        targetUserId: req.params.uid,
        oldRole: oldRole,
        newRole: role
      }
    );

    res.json({ 
      success: true, 
      message: `User role changed from ${oldRole} to ${role}` 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Delete user (Admin only)
 */
app.delete('/api/admin/users/:uid', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    // Get user data before deletion
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(req.params.uid)
      .get();

    // Delete from Firestore
    await admin
      .firestore()
      .collection('users')
      .doc(req.params.uid)
      .delete();

    // Delete from Firebase Auth
    await admin.auth().deleteUser(req.params.uid);

    // Log the deletion
    await logAuditEvent(
      req.user.uid,
      'USER_DELETED',
      {
        deletedUserId: req.params.uid,
        deletedUserData: userDoc.data()
      }
    );

    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get analytics (Admin only)
 */
app.get('/api/admin/analytics', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const usersSnapshot = await admin
      .firestore()
      .collection('users')
      .get();

    const roleCount = {
      admin: 0,
      trainer: 0,
      member: 0
    };

    usersSnapshot.forEach(doc => {
      const role = doc.data().role;
      if (role in roleCount) {
        roleCount[role]++;
      }
    });

    res.json({
      success: true,
      analytics: {
        totalUsers: usersSnapshot.size,
        roleDistribution: roleCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// TRAINER ROUTES (Require Trainer or Admin Role)
// ============================================

/**
 * Get assigned members (Trainer only)
 */
app.get('/api/trainer/members', verifyToken, verifyRole(['trainer', 'admin']), async (req, res) => {
  try {
    // In a real app, you would query for members assigned to this trainer
    const membersSnapshot = await admin
      .firestore()
      .collection('users')
      .where('role', '==', 'member')
      .get();

    const members = [];
    membersSnapshot.forEach(doc => {
      members.push({
        uid: doc.id,
        ...doc.data()
      });
    });

    res.json({ success: true, members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Create workout plan (Trainer only)
 */
app.post('/api/trainer/workouts', verifyToken, verifyRole(['trainer', 'admin']), async (req, res) => {
  try {
    const { name, description, duration, exercises } = req.body;

    if (!name || !duration) {
      return res.status(400).json({ 
        error: 'Name and duration are required' 
      });
    }

    const workoutRef = await admin
      .firestore()
      .collection('workouts')
      .add({
        name,
        description,
        duration,
        exercises: exercises || [],
        createdBy: req.user.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    // Log the action
    await logAuditEvent(
      req.user.uid,
      'WORKOUT_CREATED',
      { workoutId: workoutRef.id, workoutName: name }
    );

    res.json({
      success: true,
      message: 'Workout plan created',
      workoutId: workoutRef.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// MEMBER ROUTES (Require Member Role)
// ============================================

/**
 * Get user's assigned workout plans
 */
app.get('/api/member/workouts', verifyToken, verifyRole(['member', 'admin', 'trainer']), async (req, res) => {
  try {
    const workoutsSnapshot = await admin
      .firestore()
      .collection('workouts')
      .limit(10)
      .get();

    const workouts = [];
    workoutsSnapshot.forEach(doc => {
      workouts.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({ success: true, workouts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Log workout completion
 */
app.post('/api/member/workouts/:workoutId/complete', verifyToken, verifyRole(['member']), async (req, res) => {
  try {
    const { duration, caloriesBurned } = req.body;

    await admin
      .firestore()
      .collection('user_workouts')
      .add({
        userId: req.user.uid,
        workoutId: req.params.workoutId,
        duration,
        caloriesBurned,
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({ 
      success: true, 
      message: 'Workout logged successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// AUDIT LOGS ROUTES (Admin only)
// ============================================

/**
 * Get audit logs (Admin only)
 */
app.get('/api/admin/audit-logs', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const logsSnapshot = await admin
      .firestore()
      .collection('audit_logs')
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();

    const logs = [];
    logsSnapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error: ' + err.message 
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
