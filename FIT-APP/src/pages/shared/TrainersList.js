import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import '../member/Subscription.css'; // Reusing the plans grid styles

export default function TrainersList() {
  const trainers = [
    { name: "Alex Johnson", specialty: "Weightlifting & Strength", exp: "5 years", color: "#3b82f6" },
    { name: "Sarah Connor", specialty: "Cardio & HIIT", exp: "7 years", color: "#8b5cf6", popular: true },
    { name: "Mike Tyson", specialty: "Boxing & Core", exp: "15 years", color: "#f59e0b" },
    { name: "Emma Watson", specialty: "Yoga & Flexibility", exp: "4 years", color: "#10b981" }
  ];

  return (
    <MainLayout>
      <div className="subscription-container">
        <div className="subscription-header fade-in">
          <h1>👥 Available Trainers</h1>
          <p>Book a personal session with our expert professionals</p>
        </div>
        
        <div className="plans-grid fade-in">
          {trainers.map((t, idx) => (
            <div 
              key={idx} 
              className={`plan-card ${t.popular ? 'popular' : ''}`} 
              style={{ '--plan-color': t.color }}
            >
              {t.popular && <div className="popular-badge">Top Rated</div>}
              <h2>{t.name}</h2>
              <div className="price-tag">
                <span className="period" style={{ marginLeft: 0, fontSize: '18px', color: '#e2e8f0' }}>{t.specialty}</span>
              </div>
              <ul className="feature-list">
                <li>✓ Experience: {t.exp}</li>
                <li>✓ 1-on-1 Coaching</li>
                <li>✓ Custom Diet Plans</li>
                <li>✓ Progress Tracking</li>
              </ul>
              <button className="select-plan-btn" onClick={() => alert(`Booking request sent to ${t.name}!`)}>
                View Schedule
              </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
