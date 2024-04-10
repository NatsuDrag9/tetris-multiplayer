import { useEffect, useRef } from 'react';

type CallbackType = () => void;

function useInterval(callback: CallbackType, delay: number) {
  const savedCallback = useRef<CallbackType>();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    function tick() {
      // Using non-null assertion opertor to ensure that savedCallback.current is not undefined
      savedCallback.current!();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
}

export default useInterval;
