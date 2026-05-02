/**
 * Middleware for Authentication & Authorization
 */

const admin = require('firebase-admin');
const config = require('../config/config');

/**
 * Authenticate request using Firebase ID Token
 * Middleware to verify token from request headers
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split('Bearer ')[1];

    if (!token) {
      return res.status(config.statusCodes.unauthorized).json({
        success: false,
        error: config.messages.unauthorized,
        message: 'No token provided. Include Authorization header with Bearer token.'
      });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (err) {
      return res.status(config.statusCodes.unauthorized).json({
        success: false,
        error: config.messages.unauthorized,
        message: 'Invalid or expired token: ' + err.message
      });
    }
  } catch (err) {
    return res.status(config.statusCodes.serverError).json({
      success: false,
      error: 'Authentication error',
      message: err.message
    });
  }
};

/**
 * Verify user role from Firestore
 * Factory function to create role-checking middleware
 * 
 * Usage: verifyRole(['admin']) or verifyRole(['admin', 'trainer'])
 */
const verifyRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(config.statusCodes.unauthorized).json({
          success: false,
          error: config.messages.unauthorized,
          message: 'User not authenticated'
        });
      }

      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(req.user.uid)
        .get();

      if (!userDoc.exists) {
        return res.status(config.statusCodes.forbidden).json({
          success: false,
          error: config.messages.forbidden,
          message: 'User role not found'
        });
      }

      const userRole = userDoc.data().role;
      req.userRole = userRole;

      if (!allowedRoles.includes(userRole)) {
        // Log failed access attempt
        if (config.features.auditLogging) {
          await logAuditEvent(req.user.uid, 'PERMISSION_DENIED', {
            attemptedPath: req.path,
            attemptedMethod: req.method,
            requiredRoles: allowedRoles,
            userRole: userRole
          });
        }

        return res.status(config.statusCodes.forbidden).json({
          success: false,
          error: config.messages.forbidden,
          message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (err) {
      return res.status(config.statusCodes.serverError).json({
        success: false,
        error: 'Error verifying role',
        message: err.message
      });
    }
  };
};

/**
 * Verify specific permission
 * Factory function to create permission-checking middleware
 */
const verifyPermission = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(config.statusCodes.unauthorized).json({
          success: false,
          error: config.messages.unauthorized,
          message: 'User not authenticated'
        });
      }

      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(req.user.uid)
        .get();

      if (!userDoc.exists) {
        return res.status(config.statusCodes.forbidden).json({
          success: false,
          error: config.messages.forbidden,
          message: 'User role not found'
        });
      }

      const userRole = userDoc.data().role;
      const permissions = getRolePermissions(userRole);

      const hasRequiredPermissions = requiredPermissions.every(
        perm => permissions.includes(perm)
      );

      if (!hasRequiredPermissions) {
        return res.status(config.statusCodes.forbidden).json({
          success: false,
          error: config.messages.forbidden,
          message: `Missing required permissions: ${requiredPermissions.join(', ')}`
        });
      }

      req.userRole = userRole;
      next();
    } catch (err) {
      return res.status(config.statusCodes.serverError).json({
        success: false,
        error: 'Error verifying permission',
        message: err.message
      });
    }
  };
};

/**
 * Get all permissions for a role
 */
const getRolePermissions = (role) => {
  const rolePermissions = {
    admin: [
      'manage_users', 'manage_trainers', 'manage_members',
      'manage_branches', 'manage_plans', 'manage_subscriptions',
      'view_analytics', 'view_revenue', 'view_attendance',
      'view_engagement', 'handle_complaints', 'system_settings',
      'manage_workouts', 'manage_diets', 'view_all_data'
    ],
    trainer: [
      'create_workout_plans', 'assign_diet_plans', 'track_progress',
      'schedule_sessions', 'chat_with_clients', 'view_assigned_members',
      'upload_content', 'manage_own_profile', 'view_own_analytics'
    ],
    member: [
      'view_workout_plans', 'view_diet_plans', 'track_workouts',
      'track_weight', 'track_progress', 'book_sessions',
      'make_payments', 'renew_subscriptions', 'chat_with_trainers',
      'view_own_data', 'view_own_progress'
    ]
  };

  return rolePermissions[role] || [];
};

/**
 * Log audit event
 */
const logAuditEvent = async (userId, action, details = {}) => {
  try {
    await admin.firestore().collection('audit_logs').add({
      userId,
      action,
      details,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ipAddress: '', // Will be set by caller if needed
      userAgent: ''  // Will be set by caller if needed
    });
  } catch (err) {
    console.error('Error logging audit event:', err);
  }
};

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || config.statusCodes.serverError;
  const message = err.message || config.messages.error;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.server.isDevelopment && { stack: err.stack })
  });
};

/**
 * 404 handler
 */
const notFoundHandler = (req, res) => {
  res.status(config.statusCodes.notFound).json({
    success: false,
    error: config.messages.notFound,
    message: `Route not found: ${req.method} ${req.path}`
  });
};

module.exports = {
  authenticateToken,
  verifyRole,
  verifyPermission,
  getRolePermissions,
  logAuditEvent,
  errorHandler,
  notFoundHandler
};
