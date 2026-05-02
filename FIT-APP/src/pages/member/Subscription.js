import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./Subscription.css";

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$29",
      period: "/month",
      features: ["Access to gym floor", "Locker room access", "1 Free Assessment"],
      color: "#3b82f6"
    },
    {
      id: "pro",
      name: "Pro",
      price: "$59",
      period: "/month",
      features: ["Everything in Basic", "Group Fitness Classes", "1 PT Session/mo", "Diet Plan Access"],
      color: "#8b5cf6",
      popular: true
    },
    {
      id: "elite",
      name: "Elite",
      price: "$99",
      period: "/month",
      features: ["Everything in Pro", "Unlimited PT Sessions", "Spa & Recovery", "Guest Privileges"],
      color: "#f59e0b"
    }
  ];

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Reset after showing success message
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedPlan(null);
      }, 4000);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="subscription-container">
        <div className="subscription-header">
          <h1>💎 Membership Plans</h1>
          <p>Choose the perfect plan for your fitness journey</p>
        </div>

        {!selectedPlan && !isSuccess && (
          <div className="plans-grid">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`plan-card ${plan.popular ? 'popular' : ''}`}
                style={{ '--plan-color': plan.color }}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h2>{plan.name}</h2>
                <div className="price-tag">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <ul className="feature-list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
                <button 
                  className="select-plan-btn"
                  onClick={() => setSelectedPlan(plan)}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedPlan && !isSuccess && (
          <div className="checkout-section fade-in">
            <button className="back-btn" onClick={() => setSelectedPlan(null)}>
              ← Back to Plans
            </button>
            
            <div className="checkout-card">
              <div className="checkout-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>{selectedPlan.name} Membership</span>
                  <span>{selectedPlan.price}{selectedPlan.period}</span>
                </div>
                <div className="summary-row total">
                  <span>Total due today</span>
                  <span>{selectedPlan.price}</span>
                </div>
              </div>

              <form className="payment-form" onSubmit={handlePayment}>
                <h3>Payment Details</h3>
                
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" placeholder="John Doe" required />
                </div>
                
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength="19" required />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" maxLength="5" required />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" maxLength="4" required />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`pay-btn ${isProcessing ? 'processing' : ''}`}
                  disabled={isProcessing}
                  style={{ '--btn-color': selectedPlan.color }}
                >
                  {isProcessing ? 'Processing...' : `Pay ${selectedPlan.price}`}
                </button>
              </form>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="success-state fade-in">
            <div className="success-icon">🎉</div>
            <h2>Payment Successful!</h2>
            <p>Welcome to the {selectedPlan?.name} tier.</p>
            <p className="success-subtext">Your membership is now active. You will be redirected shortly...</p>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
