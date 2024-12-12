import React, { useState, useEffect } from 'react';
import './App.css';

function PomodoroTimer() {
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [time, setTime] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);


  useEffect(() => {
    if (Notification.permission === 'granted') {
      setNotificationPermission(true);
    } else {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission === 'granted');
      });
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (time <= 0) {
      if (isBreak) {
        setIsBreak(false);
        setSessionCount(prev => prev + 1);
        setTime(workTime);
        if (notificationPermission) {
          new Notification('Pomodoro session ended! Time for a break!');
        }
      } else {
        setIsBreak(true);
        setTime(breakTime);
        if (notificationPermission) {
          new Notification('Break ended! Time to get back to work!');
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, time, isBreak, notificationPermission]);


  const handleReset = () => {
    setTime(workTime);
    setIsActive(false);
    setSessionCount(0);
    setIsBreak(false);
  };


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  const handleWorkTimeChange = (e) => {
    const newWorkTime = e.target.value * 60; 
    setWorkTime(newWorkTime);
    if (!isActive) {
      setTime(newWorkTime);
    }
  };


  const handleBreakTimeChange = (e) => {
    const newBreakTime = e.target.value * 60;
    setBreakTime(newBreakTime);
    if (isBreak && !isActive) {
      setTime(newBreakTime); 
    }
  };

  return (
    <div className="timer-container">
      <h1>Pomodoro Timer</h1>
      <div className="timer">{formatTime(time)}</div>
      <div className="sessions">Sessions Completed: {sessionCount}</div>

      <div>
        <label>
          Work Time (minutes): 
          <input 
            type="number" 
            value={workTime / 60} 
            onChange={handleWorkTimeChange} 
            disabled={isActive} 
          />
        </label>
      </div>
      <div>
        <label>
          Break Time (minutes): 
          <input 
            type="number" 
            value={breakTime / 60} 
            onChange={handleBreakTimeChange} 
            disabled={isActive} 
          />
        </label>
      </div>

      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default PomodoroTimer;
