import React, { useState, useEffect } from 'react';
import './App.css';

function PomodoroTimer() {
  const [workTime, setWorkTime] = useState(25 * 60); 
  const [breakTime, setBreakTime] = useState(5 * 60); 
  const [time, setTime] = useState(workTime);
  const [isActive, setIsActive] = useState(false); 
  const [sessionCount, setSessionCount] = useState(0); 
  const [isBreak, setIsBreak] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    if (!isActive) {
      setTime(isBreak ? breakTime : workTime);
    }
  }, [workTime, breakTime, isBreak, isActive]);

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
        showNotification('Break time is over! Time to work!');
      } else {
        setIsBreak(true); 
        setTime(breakTime);
        showNotification('Work time is over! Time for a break!');
      }
    }

    return () => clearInterval(interval);
  }, [isActive, time, isBreak, workTime, breakTime]);

  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification(message);
    }

    // const audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
    // audio.play();

    setShowModal(true);
  };

  const handleModalResponse = (response) => {
    setShowModal(false);
    if (response === 'confirm') {
      console.log('User confirmed the session ended.');
    } else {
      console.log('User dismissed the session end.');
    }
  };

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

      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleReset}>Reset</button>

      {/* Модальное окно для подтверждения */}
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
