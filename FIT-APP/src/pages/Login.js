import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useRole } from "../context/RoleContext";
import RoleToggle from "../components/RoleToggle";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("member");
  const { saveUserRole } = useRole();

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
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

  const handleFacebookLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
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

          <h2>Login</h2>

          <RoleToggle selectedRole={selectedRole} onRoleChange={setSelectedRole} />

          <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

          <button onClick={handleLogin} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>

          <div className="divider">OR</div>

          <div className="social-row">
            <button onClick={handleGoogleLogin} disabled={loading}>Google</button>
            <button onClick={handleFacebookLogin} disabled={loading}>Facebook</button>
          </div>

          <p>
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>

        </div>
      </div>
    </div>
  );
}