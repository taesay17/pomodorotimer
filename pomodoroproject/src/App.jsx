import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function PomodoroTimer() {
  const [workTime, setWorkTime] = useState(25 * 60); 
  const [breakTime, setBreakTime] = useState(5 * 60); 
  const [time, setTime] = useState(workTime); 
  const [isActive, setIsActive] = useState(false); 
  const [sessionCount, setSessionCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [audioInterval, setAudioInterval] = useState(null); 

  const intervalRef = useRef(null);
  useEffect(() => {
    if (!isActive) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 0) {
          clearInterval(intervalRef.current); 
          return prevTime;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current); 
  }, [isActive]);

  useEffect(() => {
    if (time <= 0) {
      if (isBreak) {
        setIsBreak(false);
        setSessionCount(prev => prev + 1);
        setTime(workTime);
        showNotification('Break time is over! Time to work!');
      } else {
        setIsBreak(true);
        setTime(breakTime);
        showNotification('Work time is over! Time for a break!');
      }
    }
  }, [time, isBreak, workTime, breakTime]);

  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification(message);
    }

    const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-04.mp3');
    const interval = setInterval(() => {
      audio.play();
    }, 1000);

    setAudioInterval(interval);
    setShowModal(true);
  };

  const handleModalResponse = (response) => {
    setShowModal(false);
    if (audioInterval) {
      clearInterval(audioInterval);
    }

    if (response === 'confirm') {
      console.log('User confirmed the session ended.');
    } else {
      console.log('User dismissed the session end.');
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(workTime); 
    setSessionCount(0);
    setIsBreak(false); 
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleWorkTimeChange = (e) => setWorkTime(e.target.value * 60);
  const handleBreakTimeChange = (e) => setBreakTime(e.target.value * 60);

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

      <button onClick={() => setIsActive(prev => !prev)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleReset}>Reset</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Time is up!</h2>
            <p>Do you want to continue?</p>
            <button onClick={() => handleModalResponse('confirm')}>Yes</button>
            <button onClick={() => handleModalResponse('dismiss')}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PomodoroTimer;
