import React from 'react';

const TimerDisplay = ({ time }) => {
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours > 0 ? hours + ':' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="timer-display">
      <h2>{formatTime(time)}</h2>
    </div>
  );
};

export default TimerDisplay;
