import React from 'react';
import '../styles/RoleToggle.css';

export default function RoleToggle({ selectedRole, onRoleChange }) {
  const roles = [
    { id: 'admin', label: '👑 Admin' },
    { id: 'trainer', label: '🏋️ Trainer' },
    { id: 'member', label: '👤 Member' }
  ];

  return (
    <div className="role-toggle-container">
      <label htmlFor="role-select" className="role-label">Select Your Role</label>
      <div className="role-toggle-dropdown">
        <select
          id="role-select"
          className="role-select"
          value={selectedRole || ''}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="" disabled>Choose a role...</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
