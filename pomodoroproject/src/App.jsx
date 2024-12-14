import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import TimerDisplay from './components/TimerDisplay';
import ControlPanel from './components/ControlPanel';
import useInterval from './hooks/useInterval';

function PomodoroTimer() {
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [time, setTime] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [audioInterval, setAudioInterval] = useState(null); 

  const { startInterval, stopInterval } = useInterval(setTime, time);

  const audioRef = useRef(null); 

  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification(message);
    }

    if (audioRef.current) {
      audioRef.current.play();
    }

    const interval = setInterval(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 1000); 

    setAudioInterval(interval); 
  };

  useEffect(() => {
    if (time <= 0) {
      if (isBreak) {
        setIsBreak(false);
        setSessionCount((prev) => prev + 1);
        setTime(workTime);
        showNotification('Break time is over! Time to work!');
      } else {
        setIsBreak(true);
        setTime(breakTime);
        showNotification('Work time is over! Time for a break!');
      }
      setShowModal(true); 
    }
  }, [time, isBreak, workTime, breakTime]);

  useEffect(() => {
    if (!isActive) return;
    startInterval();
    return stopInterval;
  }, [isActive, startInterval, stopInterval]);

  const handleReset = () => {
    setTime(workTime);
    setIsActive(false);
    setSessionCount(0);
    setIsBreak(false);
    setShowModal(false);
    clearInterval(audioInterval); 
  };

  const handleWorkTimeChange = (e) => {
    let value = e.target.value;

    if (value === "") {
      setWorkTime(0);
      setTime(0);
      return;
    }

    value = parseInt(value, 10) * 60;

    if (value >= 0) {
      setWorkTime(value);
      setTime(value);
    } else {
      console.log("Please enter a positive number or zero.");
    }
  };

  const handleBreakTimeChange = (e) => {
    let value = e.target.value;

    if (value === "") {
      setBreakTime(0);
      return;
    }

    value = parseInt(value, 10) * 60;

    if (value >= 0) {
      setBreakTime(value);
    } else {
      console.log("Please enter a positive number or zero.");
    }
  };

  const handleContinue = () => {
    setShowModal(false);
    setIsActive(true); 
    if (audioInterval) {
      clearInterval(audioInterval);
    }
  };

  const handleStop = () => {
    setShowModal(false);
    handleReset();
  };

  return (
    <div className="timer-container">
      <h1>Pomodoro Timer</h1>
      <TimerDisplay time={time} />
      <div className="sessions">Sessions Completed: {sessionCount}</div>
      <ControlPanel
        workTime={workTime}
        breakTime={breakTime}
        isActive={isActive}
        setIsActive={setIsActive}
        handleWorkTimeChange={handleWorkTimeChange}
        handleBreakTimeChange={handleBreakTimeChange}
        handleReset={handleReset}
      />

      {/* Модальное окно с вопросом пользователю */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Time is up!</h2>
            <p>Would you like to continue with the next session?</p>
            <button onClick={handleContinue}>Continue</button>
            <button onClick={handleStop}>Stop & Reset</button>
          </div>
        </div>
      )}

      {/* Тег аудио для воспроизведения звука */}
      <audio ref={audioRef} src="https://www.soundjay.com/misc/sounds/bell-ringing-04.mp3" />
    </div>
  );

}




export default PomodoroTimer;
