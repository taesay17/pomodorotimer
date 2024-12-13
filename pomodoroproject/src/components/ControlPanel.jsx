import React from 'react';

function ControlPanel({ workTime, breakTime, isActive, setIsActive, handleWorkTimeChange, handleBreakTimeChange, handleReset }) {
  const generateTimeOptions = () => {
    const options = [];
    for (let i = 1; i <= 60; i++) {
      options.push(
        <option key={i} value={i}>
          {i} min
        </option>
      );
    }
    return options;
  };

  return (
    <div className="control-panel">
      <div className="time-controls">
        <label>
          Work Time:
          <select value={workTime / 60} onChange={handleWorkTimeChange}>
            {generateTimeOptions()}
          </select>
        </label>
        <label>
          Break Time:
          <select value={breakTime / 60} onChange={handleBreakTimeChange}>
            {generateTimeOptions()}
          </select>
        </label>
      </div>

      <div className="buttons">
        <button onClick={() => setIsActive(!isActive)}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default ControlPanel;
