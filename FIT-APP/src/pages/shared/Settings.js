import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [sms, setSms] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  // Initialize from localStorage or default to true (Dark Mode is the default app aesthetic)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('fitapp_theme');
    return saved !== 'light';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('fitapp_theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('fitapp_theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <MainLayout>
      <div className="card fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2>⚙️ Account Settings</h2>
          <p style={{ color: '#94a3b8' }}>Manage your app preferences and notifications</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '16px' }}>Email Notifications</h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Receive daily workout reminders</p>
            </div>
            <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: notifications ? '#6366f1' : '#334155', transition: '.4s', borderRadius: '34px' }}>
                <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: notifications ? '30px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '16px' }}>SMS Alerts</h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Get session updates via text message</p>
            </div>
            <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input type="checkbox" checked={sms} onChange={() => setSms(!sms)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: sms ? '#6366f1' : '#334155', transition: '.4s', borderRadius: '34px' }}>
                <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: sms ? '30px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '16px' }}>Private Profile</h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Hide your progress from other members</p>
            </div>
            <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input type="checkbox" checked={privacy} onChange={() => setPrivacy(!privacy)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: privacy ? '#6366f1' : '#334155', transition: '.4s', borderRadius: '34px' }}>
                <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: privacy ? '30px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-color, #fff)', fontSize: '16px' }}>Dark Mode</h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Toggle between dark and light aesthetics</p>
            </div>
            <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDarkMode ? '#6366f1' : '#334155', transition: '.4s', borderRadius: '34px' }}>
                <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: isDarkMode ? '30px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
              </span>
            </label>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
