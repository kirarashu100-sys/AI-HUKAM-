import React, { useState, useEffect } from 'react';

export default function AI_HUKAM_App() {
  // --- DATA PERSISTENCE (Phone Memory) ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hukam_user');
    return saved ? JSON.parse(saved) : {
      name: '', age: '', weight: '', path: '', 
      joinDate: new Date().toISOString(), 
      examDate: '', syllabusProgress: 1
    };
  });

  const [waterCount, setWaterCount] = useState(() => {
    return parseInt(localStorage.getItem('hukam_water')) || 0;
  });

  const [screen, setScreen] = useState('WELCOME');
  const [isPaid, setIsPaid] = useState(false);

  // Auto-Save whenever data changes
  useEffect(() => {
    localStorage.setItem('hukam_user', JSON.stringify(user));
    localStorage.setItem('hukam_water', waterCount.toString());
  }, [user, waterCount]);

  // --- LOGIC: EXAM PACE ---
  const getSyllabusLoad = () => {
    if (!user.examDate) return { speed: "Normal", msg: "Steady Pace: 2 Topics/Day" };
    const daysLeft = Math.ceil((new Date(user.examDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 15) return { speed: "EXTREME", msg: "Final Strike! 5 Topics/Day" };
    return { speed: "Normal", msg: "Target: Finish 15 days before exam" };
  };

  // --- LOGIC: TRIAL ACCESS ---
  const checkAccess = () => {
    const diffDays = Math.ceil((new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24));
    if (diffDays > 15 && !isPaid) setScreen('PAYMENT_LOCK');
    else setScreen('DASHBOARD');
  };

  // --- UI SCREENS ---
  if (screen === 'WELCOME') return (
    <div style={styles.fullScreen}>
      <h1 style={styles.logo}>AI-HUKAM</h1>
      <button onClick={() => setScreen('SETUP')} style={styles.mainBtn}>INITIALIZE MISSION</button>
    </div>
  );

  if (screen === 'SETUP') return (
    <div style={styles.fullScreen}>
      <input placeholder="Weight (kg)" type="number" onChange={(e)=>setUser({...user, weight: e.target.value})} style={styles.input}/>
      <input type="date" onChange={(e)=>setUser({...user, examDate: e.target.value})} style={styles.input}/>
      <button onClick={checkAccess} style={styles.mainBtn}>Launch System</button>
    </div>
  );

  if (screen === 'PAYMENT_LOCK') return (
    <div style={styles.fullScreen}>
      <h2 style={{color: 'red'}}>MISSION PAUSED</h2>
      <p>15-Day Trial Expired. Pay ₹2500 to Continue.</p>
      <button onClick={() => alert("Razorpay Link")} style={styles.mainBtn}>PAY NOW</button>
    </div>
  );

  const modeInfo = getSyllabusLoad();
  return (
    <div style={styles.dashboard}>
      <div style={styles.card}>
        <h3>Status: {modeInfo.speed}</h3>
        <p>{modeInfo.msg}</p>
      </div>
      <div style={styles.card}>
        <h3>Water Log: {waterCount} Bottles</h3>
        <button onClick={() => setWaterCount(waterCount + 1)} style={styles.smallBtn}>+ Add Water</button>
      </div>
      <button onClick={() => setScreen('WELCOME')} style={styles.auditBtn}>RESET SYSTEM</button>
    </div>
  );
}

const styles = {
  fullScreen: { backgroundColor: '#0a0a0a', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  dashboard: { backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '20px' },
  card: { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '15px', marginBottom: '15px', borderLeft: '4px solid #00d4ff' },
  input: { padding: '12px', margin: '10px', width: '80%', borderRadius: '8px' },
  mainBtn: { padding: '15px 40px', backgroundColor: '#00d4ff', border: 'none', borderRadius: '50px', fontWeight: 'bold' },
  smallBtn: { padding: '10px', backgroundColor: '#333', color: '#00d4ff', border: '1px solid #00d4ff' },
  auditBtn: { width: '100%', padding: '10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none' }
};

          
