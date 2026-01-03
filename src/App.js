import React, { useState, useEffect } from 'react';

export default function AI_HUKAM_App() {
  // --- Data Save karne ke liye (Phone Memory) ---
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

  // Data auto-save hota rahega
  useEffect(() => {
    localStorage.setItem('hukam_user', JSON.stringify(user));
    localStorage.setItem('hukam_water', waterCount.toString());
  }, [user, waterCount]);

  // --- Exam Logic: Kitni taiyari bachi hai ---
  const getSyllabusLoad = () => {
    if (!user.examDate) return { speed: "Normal", msg: "Target Set Karein" };
    const daysLeft = Math.ceil((new Date(user.examDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 15) return { speed: "EXTREME", msg: "Aakhri 15 din! 5 Topics roz padhein" };
    return { speed: "Steady", msg: "Aaram se padhein: 2 Topics roz" };
  };

  // --- Trial Logic: 15 din baad lock ---
  const checkAccess = () => {
    const diffDays = Math.ceil((new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24));
    if (diffDays > 15 && !isPaid) setScreen('PAYMENT_LOCK');
    else setScreen('DASHBOARD');
  };

  // --- Screens ---
  if (screen === 'WELCOME') return (
    <div style={styles.fullScreen}>
      <h1 style={styles.logo}>AI-HUKAM</h1>
      <button onClick={() => setScreen('SETUP')} style={styles.mainBtn}>START MISSION</button>
    </div>
  );

  if (screen === 'SETUP') return (
    <div style={styles.fullScreen}>
      <h2 style={{color: '#00d4ff'}}>Profile Setup</h2>
      <input placeholder="Weight (kg)" type="number" onChange={(e)=>setUser({...user, weight: e.target.value})} style={styles.input}/>
      <p style={{fontSize: '12px'}}>Exam kab hai?</p>
      <input type="date" onChange={(e)=>setUser({...user, examDate: e.target.value})} style={styles.input}/>
      <button onClick={checkAccess} style={styles.mainBtn}>Launch App</button>
    </div>
  );

  if (screen === 'PAYMENT_LOCK') return (
    <div style={styles.fullScreen}>
      <h2 style={{color: 'red'}}>TRIAL EXPIRED</h2>
      <p>15 din pure ho gaye hain. Full access ke liye pay karein.</p>
      <button onClick={() => alert("Redirecting to Payment...")} style={styles.mainBtn}>PAY ₹2500</button>
    </div>
  );

  const modeInfo = getSyllabusLoad();
  return (
    <div style={styles.dashboard}>
      <div style={styles.card}>
        <h3>Mode: {modeInfo.speed}</h3>
        <p>{modeInfo.msg}</p>
