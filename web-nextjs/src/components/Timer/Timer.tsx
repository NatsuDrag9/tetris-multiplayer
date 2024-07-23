import { useState, useEffect } from 'react';
import './Timer.scss';
import formatTime from '@utils/date-time-utils';

interface TimerProps {
  timerValue: number;
  onTimerEnd: (ended: boolean) => void;
}

const Timer = ({ timerValue, onTimerEnd }: TimerProps) => {
  const [time, setTime] = useState<number>(timerValue);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime === 0) {
          clearInterval(timerId);
          if (onTimerEnd) {
            onTimerEnd(true);
          }
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <h3 className="timer">{formatTime(time)}</h3>;
};

export default Timer;

Timer.defaultProps = {
  resetTimer: false,
};
