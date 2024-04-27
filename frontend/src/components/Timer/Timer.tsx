import { useState, useEffect } from 'react';
import './Timer.scss';
import formatTime from '@utils/date-and-time-utils';

interface TimerProps {
  timerValue: number;
}

const Timer = ({ timerValue }: TimerProps) => {
  const [time, setTime] = useState<number>(timerValue);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime === 0) {
          clearInterval(timer);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <h3 className="timer">{formatTime(time)}</h3>;
};

export default Timer;
