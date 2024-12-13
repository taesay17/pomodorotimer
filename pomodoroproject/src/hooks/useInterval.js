import { useCallback, useRef, useEffect } from 'react'; // Добавьте useEffect сюда

const useInterval = (callback, time) => {
  const intervalRef = useRef(null);

  const startInterval = useCallback(() => {
    if (intervalRef.current) return; // Если интервал уже существует, не запускаем новый
    intervalRef.current = setInterval(() => {
      callback(time => (time <= 0 ? time : time - 1)); // Снижаем время на 1 каждую секунду
    }, 1000);
  }, [callback]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Останавливаем интервал, если время завершено или сессия не активна
  useEffect(() => {
    if (time <= 0) {
      stopInterval();
    }
  }, [time, stopInterval]);

  return { startInterval, stopInterval };
};

export default useInterval;
