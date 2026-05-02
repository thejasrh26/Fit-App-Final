import React, { useState, useEffect } from "react";
import { useRole } from "../../../context/RoleContext";
import MainLayout from "../../../layouts/MainLayout";
import RoleBasedAccess from "../../../components/RoleBasedAccess";
import "./Workouts.css";

// Real exercise images from open-source free-exercise-db (public domain)
const IMG_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

const defaultWorkouts = [
  {
    id: 1,
    name: "Upper Body Power",
    subtitle: "Day 1",
    progress: 0,
    locked: false,
    exercises: [
      { id: 101, name: "Barbell Bench Press", sets: 4, reps: 8, weight: 60, duration: 5, met: 5, icon: `${IMG_BASE}/Barbell_Bench_Press_-_Medium_Grip/0.jpg`, muscles: "Chest, Triceps" },
      { id: 102, name: "Incline Dumbbell Press", sets: 3, reps: 12, weight: 20, duration: 4, met: 4, icon: `${IMG_BASE}/Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg`, muscles: "Upper Chest" },
      { id: 103, name: "Bent Over Barbell Row", sets: 4, reps: 10, weight: 50, duration: 5, met: 5, icon: `${IMG_BASE}/Bent_Over_Barbell_Row/0.jpg`, muscles: "Lats, Biceps" },
      { id: 104, name: "Shoulder Press", sets: 3, reps: 10, weight: 40, duration: 5, met: 5, icon: `${IMG_BASE}/Barbell_Shoulder_Press/0.jpg`, muscles: "Shoulders" },
      { id: 105, name: "Barbell Curl", sets: 3, reps: 12, weight: 30, duration: 4, met: 4, icon: `${IMG_BASE}/Barbell_Curl/0.jpg`, muscles: "Biceps" },
      { id: 106, name: "Bench Dips", sets: 3, reps: 15, weight: 0, duration: 4, met: 4, icon: `${IMG_BASE}/Bench_Dips/0.jpg`, muscles: "Triceps" },
    ]
  },
  {
    id: 2,
    name: "Lower Body Strength",
    subtitle: "Day 2",
    progress: 0,
    locked: false,
    exercises: [
      { id: 201, name: "Barbell Squat", sets: 4, reps: 8, weight: 80, duration: 6, met: 6, icon: `${IMG_BASE}/Barbell_Squat/0.jpg`, muscles: "Quads, Glutes" },
      { id: 202, name: "Barbell Lunge", sets: 3, reps: 12, weight: 40, duration: 5, met: 5, icon: `${IMG_BASE}/Barbell_Lunge/0.jpg`, muscles: "Quads, Glutes" },
      { id: 203, name: "Barbell Deadlift", sets: 3, reps: 10, weight: 60, duration: 5, met: 6, icon: `${IMG_BASE}/Barbell_Deadlift/0.jpg`, muscles: "Hamstrings, Glutes" },
      { id: 204, name: "Barbell Hip Thrust", sets: 3, reps: 15, weight: 50, duration: 4, met: 4, icon: `${IMG_BASE}/Barbell_Hip_Thrust/0.jpg`, muscles: "Glutes" },
      { id: 205, name: "Seated Calf Raise", sets: 4, reps: 20, weight: 30, duration: 4, met: 4, icon: `${IMG_BASE}/Barbell_Seated_Calf_Raise/0.jpg`, muscles: "Calves" },
      { id: 206, name: "Barbell Step Ups", sets: 3, reps: 20, weight: 20, duration: 6, met: 5, icon: `${IMG_BASE}/Barbell_Step_Ups/0.jpg`, muscles: "Legs, Glutes" },
    ]
  },
  {
    id: 3,
    name: "Push Day",
    subtitle: "Day 3",
    progress: 0,
    locked: false,
    exercises: [
      { id: 301, name: "Dumbbell Bench Press", sets: 4, reps: 10, weight: 25, duration: 5, met: 5, icon: `${IMG_BASE}/Alternating_Floor_Press/0.jpg`, muscles: "Chest" },
      { id: 302, name: "Around The Worlds", sets: 3, reps: 15, weight: 10, duration: 4, met: 4, icon: `${IMG_BASE}/Around_The_Worlds/0.jpg`, muscles: "Chest, Shoulders" },
      { id: 303, name: "Arnold Dumbbell Press", sets: 4, reps: 12, weight: 15, duration: 4, met: 4, icon: `${IMG_BASE}/Arnold_Dumbbell_Press/0.jpg`, muscles: "Shoulders" },
      { id: 304, name: "Alternating Deltoid Raise", sets: 3, reps: 12, weight: 10, duration: 4, met: 4, icon: `${IMG_BASE}/Alternating_Deltoid_Raise/0.jpg`, muscles: "Side Delts" },
      { id: 305, name: "Band Skull Crusher", sets: 3, reps: 12, weight: 0, duration: 4, met: 4, icon: `${IMG_BASE}/Band_Skull_Crusher/0.jpg`, muscles: "Triceps" },
      { id: 306, name: "Bench Dips", sets: 3, reps: 15, weight: 0, duration: 4, met: 4, icon: `${IMG_BASE}/Bench_Dips/1.jpg`, muscles: "Triceps" },
    ]
  },
  {
    id: 4,
    name: "Pull Day",
    subtitle: "Day 4",
    progress: 0,
    locked: false,
    exercises: [
      { id: 401, name: "Barbell Deadlift", sets: 4, reps: 6, weight: 100, duration: 8, met: 6, icon: `${IMG_BASE}/Barbell_Deadlift/0.jpg`, muscles: "Back, Hamstrings" },
      { id: 402, name: "Bent Over Barbell Row", sets: 3, reps: 10, weight: 50, duration: 5, met: 5, icon: `${IMG_BASE}/Bent_Over_Barbell_Row/1.jpg`, muscles: "Lats, Rhomboids" },
      { id: 403, name: "Alternating Kettlebell Row", sets: 3, reps: 12, weight: 20, duration: 5, met: 5, icon: `${IMG_BASE}/Alternating_Kettlebell_Row/0.jpg`, muscles: "Mid Back" },
      { id: 404, name: "Barbell Rear Delt Row", sets: 3, reps: 15, weight: 30, duration: 4, met: 4, icon: `${IMG_BASE}/Barbell_Rear_Delt_Row/0.jpg`, muscles: "Rear Delts" },
      { id: 405, name: "Alternate Hammer Curl", sets: 3, reps: 12, weight: 15, duration: 4, met: 4, icon: `${IMG_BASE}/Alternate_Hammer_Curl/0.jpg`, muscles: "Biceps, Forearms" },
      { id: 406, name: "Incline Dumbbell Curl", sets: 3, reps: 12, weight: 12, duration: 4, met: 4, icon: `${IMG_BASE}/Alternate_Incline_Dumbbell_Curl/0.jpg`, muscles: "Biceps" },
    ]
  },
  {
    id: 5,
    name: "Core & Abs",
    subtitle: "Day 5",
    progress: 0,
    locked: false,
    exercises: [
      { id: 501, name: "Ab Roller", sets: 3, reps: 10, weight: 0, duration: 4, met: 4, icon: `${IMG_BASE}/Ab_Roller/0.jpg`, muscles: "Core" },
      { id: 502, name: "Air Bike Crunches", sets: 3, reps: 20, weight: 0, duration: 4, met: 4, icon: `${IMG_BASE}/Air_Bike/0.jpg`, muscles: "Obliques" },
      { id: 503, name: "Bent-Knee Hip Raise", sets: 3, reps: 15, weight: 0, duration: 5, met: 4, icon: `${IMG_BASE}/Bent-Knee_Hip_Raise/0.jpg`, muscles: "Lower Abs" },
      { id: 504, name: "3/4 Sit-Up", sets: 3, reps: 20, weight: 0, duration: 4, met: 4, icon: `${IMG_BASE}/3_4_Sit-Up/0.jpg`, muscles: "Abs" },
      { id: 505, name: "Barbell Ab Rollout", sets: 2, reps: 10, weight: 0, duration: 4, met: 4, icon: `${IMG_BASE}/Barbell_Ab_Rollout/0.jpg`, muscles: "Core, Shoulders" },
      { id: 506, name: "Barbell Side Bend", sets: 3, reps: 15, weight: 10, duration: 4, met: 3, icon: `${IMG_BASE}/Barbell_Side_Bend/0.jpg`, muscles: "Obliques" },
    ]
  },
  {
    id: 6,
    name: "Functional Full Body",
    subtitle: "Day 6",
    progress: 0,
    locked: true,
    exercises: [
      { id: 601, name: "Kettlebell Windmill", sets: 3, reps: 10, weight: 16, duration: 6, met: 5, icon: `${IMG_BASE}/Advanced_Kettlebell_Windmill/0.jpg`, muscles: "Full Body" },
      { id: 602, name: "Bench Jump", sets: 3, reps: 15, weight: 0, duration: 5, met: 8, icon: `${IMG_BASE}/Bench_Jump/0.jpg`, muscles: "Legs, Cardio" },
      { id: 603, name: "Barbell Full Squat", sets: 4, reps: 10, weight: 60, duration: 6, met: 6, icon: `${IMG_BASE}/Barbell_Full_Squat/0.jpg`, muscles: "Full Body" },
      { id: 604, name: "Medicine Ball Throw", sets: 3, reps: 15, weight: 10, duration: 4, met: 6, icon: `${IMG_BASE}/Backward_Medicine_Ball_Throw/0.jpg`, muscles: "Core, Shoulders" },
      { id: 605, name: "Renegade Rows", sets: 3, reps: 12, weight: 12, duration: 5, met: 5, icon: `${IMG_BASE}/Alternating_Renegade_Row/0.jpg`, muscles: "Back, Core" },
      { id: 606, name: "Barbell Walking Lunge", sets: 3, reps: 20, weight: 30, duration: 5, met: 5, icon: `${IMG_BASE}/Barbell_Walking_Lunge/0.jpg`, muscles: "Legs, Glutes" },
    ]
  },
  {
    id: 7,
    name: "Hypertrophy Arms",
    subtitle: "Day 7",
    progress: 0,
    locked: true,
    exercises: [
      { id: 701, name: "Close-Grip Bench Press", sets: 4, reps: 10, weight: 50, duration: 6, met: 5, icon: `${IMG_BASE}/Barbell_Bench_Press_-_Medium_Grip/1.jpg`, muscles: "Triceps, Chest" },
      { id: 702, name: "Barbell Curl", sets: 4, reps: 10, weight: 30, duration: 5, met: 4, icon: `${IMG_BASE}/Barbell_Curl/1.jpg`, muscles: "Biceps" },
      { id: 703, name: "Bench Dips", sets: 3, reps: 12, weight: 0, duration: 4, met: 4, icon: `${IMG_BASE}/Bench_Dips/0.jpg`, muscles: "Triceps" },
      { id: 704, name: "Incline Dumbbell Curls", sets: 3, reps: 12, weight: 12, duration: 4, met: 4, icon: `${IMG_BASE}/Alternate_Incline_Dumbbell_Curl/1.jpg`, muscles: "Biceps" },
      { id: 705, name: "Barbell Shrug", sets: 3, reps: 15, weight: 50, duration: 4, met: 4, icon: `${IMG_BASE}/Barbell_Shrug/0.jpg`, muscles: "Traps" },
      { id: 706, name: "Arm Circles", sets: 3, reps: 20, weight: 0, duration: 3, met: 2, icon: `${IMG_BASE}/Arm_Circles/0.jpg`, muscles: "Shoulders, Warmup" },
    ]
  },
  {
    id: 8,
    name: "Cardio & Endurance",
    subtitle: "Day 8",
    progress: 0,
    locked: true,
    exercises: [
      { id: 801, name: "Bench Sprint", sets: 5, reps: 1, weight: 0, duration: 10, met: 9, icon: `${IMG_BASE}/Bench_Sprint/0.jpg`, muscles: "Cardio, Legs" },
      { id: 802, name: "Bicycling", sets: 1, reps: 1, weight: 0, duration: 15, met: 7, icon: `${IMG_BASE}/Bicycling_Stationary/0.jpg`, muscles: "Cardio, Legs" },
      { id: 803, name: "Battling Ropes", sets: 3, reps: 1, weight: 0, duration: 5, met: 8, icon: `${IMG_BASE}/Battling_Ropes/0.jpg`, muscles: "Cardio, Shoulders" },
      { id: 804, name: "Bear Crawl", sets: 3, reps: 1, weight: 0, duration: 4, met: 6, icon: `${IMG_BASE}/Bear_Crawl_Sled_Drags/0.jpg`, muscles: "Full Body, Cardio" },
      { id: 805, name: "Alternate Leg Bound", sets: 3, reps: 20, weight: 0, duration: 4, met: 7, icon: `${IMG_BASE}/Alternate_Leg_Diagonal_Bound/0.jpg`, muscles: "Cardio, Quads" },
      { id: 806, name: "Band Pull Apart", sets: 3, reps: 20, weight: 0, duration: 3, met: 3, icon: `${IMG_BASE}/Band_Pull_Apart/0.jpg`, muscles: "Shoulders, Warmup" },
    ]
  }
];

export default function Workouts() {
  const { userRole, loading } = useRole();
  const [workouts, setWorkouts] = useState(defaultWorkouts);
  const [view, setView] = useState("LIST"); // LIST, DETAIL, PLAYER
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  
  // Player state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // seconds
  const [completedExercises, setCompletedExercises] = useState([]);
  
  const userWeightKg = 70; // Hardcoded or fetch from profile

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  if (loading) return <MainLayout><div className="workouts-page fade-in">Loading...</div></MainLayout>;

  // Calorie calculation helper
  const calculateCalories = (met, durationMins) => {
    return Math.round((met * userWeightKg * durationMins) / 60);
  };

  const handleWorkoutClick = (workout) => {
    if (workout.locked) return;
    setSelectedWorkout(workout);
    setView("DETAIL");
  };

  const startWorkout = () => {
    setCurrentExerciseIndex(0);
    setTimeElapsed(0);
    setTimerActive(false);
    setCompletedExercises([]);
    setView("PLAYER");
  };

  const nextExercise = () => {
    setCompletedExercises([...completedExercises, selectedWorkout.exercises[currentExerciseIndex].id]);
    
    if (currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTimeElapsed(0);
      setTimerActive(false);
    } else {
      // Workout finished
      updateWorkoutProgress(selectedWorkout.id, 100);
      setView("LIST");
    }
  };

  const updateWorkoutProgress = (workoutId, progress) => {
    setWorkouts(workouts.map(w => w.id === workoutId ? { ...w, progress } : w));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 1. Workout List Screen
  if (view === "LIST") {
    return (
      <MainLayout>
        <div className="responsive-container fade-in">
          <div className="page-header">
            <h1>Workouts</h1>
            <p>Select a workout plan to begin</p>
          </div>
          
          <div className="workout-list-grid">
            {workouts.map(workout => (
              <div 
                key={workout.id} 
                className={`workout-card-modern ${workout.locked ? 'locked' : ''}`}
                onClick={() => handleWorkoutClick(workout)}
              >
                <div className="workout-card-left">
                  <div className="progress-circle-modern" style={{ background: `conic-gradient(#1abc9c ${workout.progress}%, #f0f0f0 ${workout.progress}%)`}}>
                    <div className="circle-inner-modern">{workout.progress}%</div>
                  </div>
                </div>
                <div className="workout-card-info">
                  <span className="workout-subtitle">{workout.subtitle}</span>
                  <h3 className="workout-title">{workout.name}</h3>
                </div>
                <div className="workout-card-action">
                  {workout.locked ? <span className="lock-icon">🔒</span> : <span className="arrow-icon">›</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // 2. Exercise List Screen (Detail)
  if (view === "DETAIL") {
    return (
      <MainLayout>
        <div className="responsive-container fade-in">
          <div className="detail-header-modern">
            <button className="icon-btn-modern" onClick={() => setView("LIST")}>←</button>
            <h2>Exercises</h2>
            <button className="text-btn-modern" onClick={() => setView("LIST")}>Skip</button>
          </div>

          <div className="detail-subheader-modern">
            <div className="progress-circle-modern" style={{ background: `conic-gradient(#ff4d4d ${selectedWorkout.progress}%, #f0f0f0 ${selectedWorkout.progress}%)`}}>
              <div className="circle-inner-modern" style={{color: '#ff4d4d'}}>{selectedWorkout.progress}%</div>
            </div>
            <div className="subheader-text-modern">
              <span className="subtitle-modern">{selectedWorkout.subtitle}</span>
              <h3 className="title-modern">{selectedWorkout.name}</h3>
            </div>
          </div>

          <div className="exercises-list-modern">
            {selectedWorkout.exercises.map((ex, idx) => (
              <div key={ex.id} className="exercise-row">
                <div className="exercise-img-wrapper">
                  <img src={ex.icon} alt={ex.name} />
                </div>
                <div className="exercise-row-info">
                  <h4>{ex.name}</h4>
                  <p>{ex.sets}x{ex.reps} {ex.weight > 0 ? `x ${ex.weight}kg` : `(Duration: ${ex.duration} min)`}</p>
                </div>
                <div className="exercise-arrow-modern">›</div>
              </div>
            ))}
          </div>

          <div className="bottom-action-modern">
            <button className="btn-primary-modern" onClick={startWorkout}>BEGIN WORKOUT</button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 3. Workout Player Screen
  if (view === "PLAYER") {
    const currentEx = selectedWorkout.exercises[currentExerciseIndex];
    const totalExercises = selectedWorkout.exercises.length;
    const caloriesBurnedSoFar = calculateCalories(currentEx.met, timeElapsed / 60);
    const targetDurationSeconds = currentEx.duration * 60;

    return (
      <MainLayout>
        <div className="workout-player fade-in">
          <div className="player-header">
            <button className="icon-btn-modern" onClick={() => setView("DETAIL")}>✕</button>
            <span>{currentExerciseIndex + 1} OF {totalExercises}</span>
            <button className="icon-btn-modern hidden">✕</button>
          </div>

          <div className="player-image-container">
            <img src={currentEx.icon} alt={currentEx.name} className="player-image" />
          </div>

          <div className="player-info-container">
            <h2 className="player-exercise-name">{currentEx.name}</h2>
            <p className="player-exercise-muscles">Target: {currentEx.muscles}</p>
            
            <div className="player-stats-grid">
              <div className="stat-box">
                <span className="stat-label">SETS</span>
                <span className="stat-value">{currentEx.sets}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">REPS</span>
                <span className="stat-value">{currentEx.reps}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">WEIGHT</span>
                <span className="stat-value">{currentEx.weight}kg</span>
              </div>
            </div>

            <div className="player-timer-section">
              <div className="timer-display">{formatTime(timeElapsed)}</div>
              <div className="timer-target">/ {formatTime(targetDurationSeconds)}</div>
              <p className="calorie-display">Calories burned: ~{caloriesBurnedSoFar} kcal</p>
            </div>
            
            <div className="player-controls">
              <button 
                className={`control-btn ${timerActive ? 'pause' : 'start'}`}
                onClick={() => setTimerActive(!timerActive)}
              >
                {timerActive ? 'PAUSE' : 'START'}
              </button>
              <button className="control-btn next" onClick={nextExercise}>
                {currentExerciseIndex === totalExercises - 1 ? 'FINISH' : 'NEXT'}
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return null;
}
