import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💪</span>
          FitFlow
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <a href="#about" className="nav-links">
              About
            </a>
          </li>
          <li className="nav-item">
            <a href="#programs" className="nav-links">
              Programs
            </a>
          </li>
          <li className="nav-item">
            <a href="#contact" className="nav-links">
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-auth">
          <Link to="/login" className="nav-links login-btn">
            Log In
          </Link>
          <Link to="/signup" className="nav-links signup-btn">
            Membership
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
