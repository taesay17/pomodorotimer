class PomodoroModel {
    constructor() {
      this.workTime = 25 * 60; 
      this.breakTime = 5 * 60; 
      this.timeLeft = this.workTime;
      this.isActive = false;
      this.isBreak = false;
      this.sessionCount = 0;
      this.timerInterval = null;
    }
  
    toggleTimer() {
      if (this.isActive) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    }
  
    startTimer() {
      this.isActive = true;
      this.timerInterval = setInterval(() => {
        this.timeLeft -= 1;
        if (this.timeLeft <= 0) {
          this.toggleSession();
        }
      }, 1000);
    }

    stopTimer() {
      clearInterval(this.timerInterval);
      this.isActive = false;
    }
  

    toggleSession() {
      if (this.isBreak) {
        this.sessionCount += 1;
        this.isBreak = false;
        this.timeLeft = this.workTime;
      } else {
        this.isBreak = true;
        this.timeLeft = this.breakTime;
      }
    }
  

    resetTimer() {
      this.stopTimer();
      this.timeLeft = this.workTime;
      this.isBreak = false;
      this.sessionCount = 0;
    }
  

    setWorkTime(minutes) {
      if (minutes > 0) {
        this.workTime = minutes * 60;
        if (!this.isActive) {
          this.timeLeft = this.workTime;
        }
      }
    }
  

    setBreakTime(minutes) {
      if (minutes > 0) {
        this.breakTime = minutes * 60;
        if (!this.isActive) {
          this.timeLeft = this.breakTime;
        }
      }
    }
  

    formatTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }
  
  export default PomodoroModel;
  