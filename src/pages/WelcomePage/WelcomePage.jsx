import React from "react";
import { FaBullhorn, FaBuilding, FaHandshake, FaUsers, FaCheckCircle } from "react-icons/fa";
import "./WelcomePage.css";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {

    const navigate = useNavigate();
  return (
    <div className="welcome-container">
      {/* Hero Section */}
      <header className="welcome-hero">
        <div className="hero-overlay">
          <h1 className="welcome-title">🌉 CivicBridge</h1>
          <p className="welcome-tagline">
            Bridging the gap between <span>Citizens</span> and <span>Government</span>
          </p>
          <div className="welcome-actions">
            <button className="btn primary" onClick={()=>navigate('/login')}>
              Get Started
            </button>
            <button className="btn secondary">Learn More</button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="welcome-features">
        <div className="feature-card fade-in">
          <FaBullhorn className="feature-icon" />
          <h3>Raise Your Voice</h3>
          <p>Citizens can post their concerns directly on the platform.</p>
        </div>
        <div className="feature-card fade-in">
          <FaBuilding className="feature-icon" />
          <h3>Government Action</h3>
          <p>Officials review and respond to public concerns transparently.</p>
        </div>
        <div className="feature-card fade-in">
          <FaHandshake className="feature-icon" />
          <h3>Better Collaboration</h3>
          <p>Encouraging trust and cooperation between public & government.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="welcome-howitworks">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step-card">
            <FaUsers className="step-icon" />
            <h4>Join the Platform</h4>
            <p>Sign up and become a part of CivicBridge to contribute to your community.</p>
          </div>
          <div className="step-card">
            <FaBullhorn className="step-icon" />
            <h4>Raise Concerns</h4>
            <p>Report issues or suggest improvements in your city.</p>
          </div>
          <div className="step-card">
            <FaCheckCircle className="step-icon" />
            <h4>Track Progress</h4>
            <p>Stay updated as officials work on resolving community concerns.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <p>© {new Date().getFullYear()} CivicBridge • All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default WelcomePage;
