import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { useRole } from "../context/RoleContext";
import RoleToggle from "../components/RoleToggle";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const { saveUserRole } = useRole();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 👤 Create name from email
      let name = email.split("@")[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);

      await updateProfile(userCredential.user, {
        displayName: name
      });

      // 👑 Save user role to Firestore
      await saveUserRole(userCredential.user.uid, selectedRole);

      // Navigate to role-specific dashboard
      const dashboards = {
        admin: "/admin/dashboard",
        trainer: "/trainer/dashboard",
        member: "/member/dashboard"
      };
      navigate(dashboards[selectedRole]);
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="glass glow login-card">
          <h2>Signup</h2>

          <RoleToggle selectedRole={selectedRole} onRoleChange={setSelectedRole} />

          <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

          <button onClick={handleSignup} disabled={loading}>{loading ? "Creating account..." : "Signup"}</button>

          <p>
            Already have account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}