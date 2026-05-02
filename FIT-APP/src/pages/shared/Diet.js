import React, { useState } from "react";
import { useRole } from "../../context/RoleContext";
import MainLayout from "../../layouts/MainLayout";
import RoleBasedAccess from "../../components/RoleBasedAccess";
import "./Diet.css";

export default function Diet() {
  const { userRole, loading } = useRole();
  const [diets, setDiets] = useState([
    {
      id: 1,
      name: "High Protein Muscle Build",
      trainer: "John Doe",
      calories: 2500,
      protein: "150g",
      carbs: "250g",
      fat: "80g"
    },
    {
      id: 2,
      name: "Low Carb Weight Loss",
      trainer: "Jane Smith",
      calories: 1800,
      protein: "120g",
      carbs: "100g",
      fat: "60g"
    }
  ]);

  if (loading) return <div>Loading...</div>;

  return (
    <MainLayout>
      <div className="diet-page">
        <div className="page-header">
          <h1>🍎 Diet Plans</h1>
          <p>Nutritional guidance for your fitness goals</p>
        </div>

        {/* Admin & Trainer: Create Diet Plan */}
        <RoleBasedAccess roles={["admin", "trainer"]}>
          <div className="action-bar">
            <button className="primary-btn">+ Create New Diet Plan</button>
          </div>
        </RoleBasedAccess>

        {/* All Roles: View Diet Plans */}
        <div className="diets-container">
          <div className="diets-grid">
            {diets.map((diet) => (
              <div key={diet.id} className="diet-card">
                <div className="diet-header">
                  <h3>{diet.name}</h3>
                </div>
                
                <div className="diet-info">
                  <p><strong>Trainer:</strong> {diet.trainer}</p>
                  <p><strong>Daily Calories:</strong> {diet.calories}</p>
                </div>

                <div className="macros">
                  <div className="macro">
                    <span className="label">Protein</span>
                    <span className="value">{diet.protein}</span>
                  </div>
                  <div className="macro">
                    <span className="label">Carbs</span>
                    <span className="value">{diet.carbs}</span>
                  </div>
                  <div className="macro">
                    <span className="label">Fat</span>
                    <span className="value">{diet.fat}</span>
                  </div>
                </div>

                <div className="diet-actions">
                  <RoleBasedAccess roles={["member"]}>
                    <button className="action-btn secondary">Follow Plan</button>
                  </RoleBasedAccess>

                  <RoleBasedAccess roles={["trainer", "admin"]}>
                    <button className="action-btn secondary">Edit</button>
                    <button className="action-btn danger">Delete</button>
                  </RoleBasedAccess>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Members: My Diet Tracking */}
        <RoleBasedAccess roles={["member"]}>
          <div className="tracking-section">
            <h2>Daily Intake Tracking</h2>
            <div className="tracking-card">
              <div className="intake-item">
                <span>Today's Calories</span>
                <p>1450 / 2500 cal</p>
              </div>
              <div className="intake-item">
                <span>Protein</span>
                <p>95g / 150g</p>
              </div>
              <div className="intake-item">
                <span>Carbs</span>
                <p>145g / 250g</p>
              </div>
              <div className="intake-item">
                <span>Fat</span>
                <p>45g / 80g</p>
              </div>
            </div>
          </div>
        </RoleBasedAccess>
      </div>
    </MainLayout>
  );
}
