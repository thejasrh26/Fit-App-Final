import React, { useState } from "react";
import { useRole } from "../../../context/RoleContext";
import MainLayout from "../../../layouts/MainLayout";
import RoleBasedAccess from "../../../components/RoleBasedAccess";
import "./Workouts.css";
import legsImg from "../../../images/workouts/legs.png";
import shouldersImg from "../../../images/workouts/shoulders.png";
import coreImg from "../../../images/workouts/core.png";
import backImg from "../../../images/workouts/back.png";
import bicepsImg from "../../../images/workouts/biceps.png";
import tricepsImg from "../../../images/workouts/triceps.png";
import chestImg from "../../../images/workouts/chest.png";
import glutesImg from "../../../images/workouts/glutes.png";
import calvesImg from "../../../images/workouts/calves.png";
import forearmsImg from "../../../images/workouts/forearms.png";
import fullbodyImg from "../../../images/workouts/fullbody.png";



export default function Workouts() {
  const { userRole, loading } = useRole();
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const workouts = [
    {
      id: 1,
      name: "Legs + Shoulders",
      trainer: "John Doe",
      difficulty: "Intermediate",
      duration: "60 min",
      exercises: [
        { name: "Treadmill", desc: "8 min, 110 - 140 bpm", icon: legsImg },
        { name: "Narrow stance leg press", desc: "3x15x45 kg", icon: legsImg },
        { name: "Inner adductor work out", desc: "3x15x30 kg", icon: legsImg },
        { name: "Leg abduction with a machine", desc: "3x15x25 kg", icon: legsImg },
        { name: "Standing dumbbell lateral and front raise", desc: "3x15x5 kg", icon: shouldersImg },
        { name: "Incline reverse dumbbell rear delt fly", desc: "3x15x6 kg", icon: shouldersImg }
      ]
    },
    {
      id: 2,
      name: "Upper Body Strength",
      trainer: "Jane Smith",
      difficulty: "Advanced",
      duration: "45 min",
      exercises: [
        { name: "Barbell Row", desc: "4x10x60 kg", icon: backImg },
        { name: "Bicep Curls", desc: "4x12x15 kg", icon: bicepsImg },
        { name: "Tricep Extensions", desc: "4x12x20 kg", icon: tricepsImg }
      ]
    },
    {
      id: 3,
      name: "HIIT Cardio Core",
      trainer: "Mike Johnson",
      difficulty: "Beginner",
      duration: "30 min",
      exercises: [
        { name: "Jumping Jacks", desc: "3x60 seconds", icon: fullbodyImg },
        { name: "Plank", desc: "3x60 seconds", icon: coreImg },
        { name: "Crunches", desc: "3x20 reps", icon: coreImg }
      ]
    },
    {
      id: 4,
      name: "Chest & Accessory",
      trainer: "Alex Turner",
      difficulty: "Intermediate",
      duration: "50 min",
      exercises: [
        { name: "Flat Bench Press", desc: "4x10x60 kg", icon: chestImg },
        { name: "Incline Dumbbell Press", desc: "3x12x20 kg", icon: chestImg },
        { name: "Barbell Hip Thrusts", desc: "3x15x50 kg", icon: glutesImg },
        { name: "Standing Calf Raises", desc: "4x20x30 kg", icon: calvesImg },
        { name: "Wrist Curls", desc: "3x15x10 kg", icon: forearmsImg }
      ]
    }
  ];

  if (loading) return <div>Loading...</div>;

  // Detailed View (matches user screenshot)
  if (selectedWorkout) {
    return (
      <MainLayout>
        <div className="workout-detail-page fade-in">
          {/* Header Row */}
          <div className="detail-header">
            <button className="icon-btn" onClick={() => setSelectedWorkout(null)}>←</button>
            <h2>Exercises</h2>
            <button className="text-btn">Skip</button>
          </div>

          {/* Sub Header Row */}
          <div className="detail-subheader card">
            <div className="progress-circle">
              <div className="circle-inner">0%</div>
            </div>
            <div className="subheader-text">
              <span className="subtitle">2 workout day</span>
              <h3 style={{ textTransform: 'lowercase' }}>{selectedWorkout.name}</h3>
            </div>
          </div>

          {/* Exercises List */}
          <div className="exercises-list">
            {selectedWorkout.exercises.map((ex, idx) => (
              <div key={idx} className="exercise-item">
                <div className="exercise-icon">
                  {typeof ex.icon === 'string' && ex.icon.includes('/static/media/') ? <img src={ex.icon} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : typeof ex.icon === 'string' && ex.icon.length > 5 ? <img src={ex.icon} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : ex.icon}
                </div>
                <div className="exercise-info">
                  <h4>{ex.name}</h4>
                  <p>{ex.desc}</p>
                </div>
                <div className="exercise-arrow">›</div>
              </div>
            ))}
          </div>

          {/* Fixed Bottom Button */}
          <div className="bottom-action">
            <button className="begin-btn">BEGIN WORKOUT</button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // List View
  return (
    <MainLayout>
      <div className="workouts-page fade-in">
        <div className="page-header">
          <h1>💪 Workouts</h1>
          <p>Select a workout plan to begin</p>
        </div>

        <RoleBasedAccess roles={["admin", "trainer"]}>
          <div className="action-bar">
            <button className="primary-btn">+ Create New Workout</button>
          </div>
        </RoleBasedAccess>

        <div className="workouts-container">
          <div className="workouts-grid">
            {workouts.map((workout) => (
              <div key={workout.id} className="workout-card">
                <div className="workout-header">
                  <h3>{workout.name}</h3>
                  <span className="difficulty">{workout.difficulty}</span>
                </div>
                
                <div className="workout-meta">
                  <p><strong>Trainer:</strong> {workout.trainer}</p>
                  <p><strong>Duration:</strong> {workout.duration}</p>
                  <p><strong>Exercises:</strong> {workout.exercises.length}</p>
                </div>

                <div className="workout-actions">
                  <RoleBasedAccess roles={["member"]}>
                    <button className="action-btn secondary" onClick={() => setSelectedWorkout(workout)}>
                      View Exercises
                    </button>
                  </RoleBasedAccess>

                  <RoleBasedAccess roles={["trainer", "admin"]}>
                    <button className="action-btn secondary" onClick={() => setSelectedWorkout(workout)}>View</button>
                    <button className="action-btn danger">Delete</button>
                  </RoleBasedAccess>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
