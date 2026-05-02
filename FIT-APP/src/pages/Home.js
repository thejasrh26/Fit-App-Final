import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import heroImage from "../images/hero-fitnes.jpg";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Where Fitness<br />
              Becomes Your<br />
              <span className="gradient-text">Lifestyle</span>
            </h1>
            <p className="hero-subtitle">
              Transform your body, elevate your mind. Join thousands of members achieving their fitness goals with personalized workouts and expert guidance.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn btn-primary">
                Get Started Now
              </Link>
              <a href="#about" className="btn btn-secondary">
                Learn More
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <h3>5000+</h3>
                <p>Active Members</p>
              </div>
              <div className="stat">
                <h3>200+</h3>
                <p>Workouts</p>
              </div>
              <div className="stat">
                <h3>98%</h3>
                <p>Success Rate</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img 
                src={heroImage} 
                alt="Fitness Hero" 
                className="hero-image"
              />
              <div className="image-overlay"></div>
              <div className="glow-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section" id="about">
        <h2>Why Choose FitFlow?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your workouts, achievements, and body metrics in real-time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized Plans</h3>
            <p>Get custom workout plans tailored to your fitness goals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community Support</h3>
            <p>Connect with thousands of fitness enthusiasts on their journey</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Expert Guidance</h3>
            <p>Learn from fitness professionals and certified trainers</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
