
import { useEffect, useRef } from "react";

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const intervalId = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(intervalId); 
    }
  }, [delay]);
};

export default useInterval;
