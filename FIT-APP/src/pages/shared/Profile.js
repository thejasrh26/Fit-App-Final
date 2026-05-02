import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    fitnessGoal: '',
    weight: '',
    height: '',
    bio: ''
  });

  // Fetch real-time data from Firebase on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Start with auth provider data
        const initialData = {
          fullName: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          fitnessGoal: '',
          weight: '',
          height: '',
          bio: ''
        };

        // Fetch custom data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const dbData = userDocSnap.data();
          setFormData({
            ...initialData,
            ...dbData,
            // Ensure email isn't overridden if db has none
            email: user.email || dbData.email || '',
            fullName: user.displayName || dbData.fullName || ''
          });
        } else {
          setFormData(initialData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMsg("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      // 1. Update Firebase Auth Profile (DisplayName)
      if (formData.fullName !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.fullName
        });
      }

      // 2. Update Firestore DB Custom Fields
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        fullName: formData.fullName,
        phone: formData.phone,
        fitnessGoal: formData.fitnessGoal,
        weight: formData.weight,
        height: formData.height,
        bio: formData.bio,
        updatedAt: new Date()
      });

      setSuccessMsg("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMsg(error.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  // Generate Initials for Avatar
  const getInitials = (name) => {
    if (!name) return "👤";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <MainLayout>
      <div className="card fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
            <div className="loading-dots"><span>.</span><span>.</span><span>.</span></div>
            <p>Loading Profile Data...</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ 
                width: '100px', height: '100px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '32px', fontWeight: '800', color: '#fff',
                boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
              }}>
                {getInitials(formData.fullName)}
              </div>
              <div>
                <h2 style={{ margin: '0 0 5px 0', fontSize: '28px', color: 'var(--text-color, #fff)' }}>
                  {formData.fullName || 'Complete Your Profile'}
                </h2>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '15px' }}>
                  {auth.currentUser?.email}
                </p>
                <div style={{ display: 'inline-block', marginTop: '10px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                  Verified Member
                </div>
              </div>
            </div>

            {successMsg && (
              <div style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>✓</span> {successMsg}
              </div>
            )}

            {errorMsg && (
              <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '12px', marginBottom: '20px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave}>
              <h3 style={{ color: 'var(--text-color, #fff)', marginBottom: '20px', fontSize: '18px' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" style={{ background: '#1e293b', padding: '14px', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', width: '100%', boxSizing: 'border-box' }} />
                </div>
                
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" style={{ background: '#1e293b', padding: '14px', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>

              <h3 style={{ color: 'var(--text-color, #fff)', marginBottom: '20px', fontSize: '18px' }}>Body Metrics & Goals</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Weight (kg)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="75" style={{ background: '#1e293b', padding: '14px', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', width: '100%', boxSizing: 'border-box' }} />
                </div>
                
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Height (cm)</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="180" style={{ background: '#1e293b', padding: '14px', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', width: '100%', boxSizing: 'border-box' }} />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Primary Goal</label>
                  <input type="text" name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange} placeholder="Build Muscle" style={{ background: '#1e293b', padding: '14px', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
                <label style={{ marginBottom: '8px', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Bio / Additional Notes</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Tell your trainer about any injuries or specific preferences..." style={{ background: '#1e293b', padding: '14px', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', width: '100%', boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit' }}></textarea>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button type="button" onClick={() => setFormData(prev => ({...prev}))} style={{ padding: '16px 30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{ padding: '16px 40px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', fontWeight: '700', fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px -6px rgba(99, 102, 241, 0.6)', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </MainLayout>
  );
}
