import { RETURN_HOME_TIMER } from '@constants/game';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useReturnTo = (path: string) => {
  let timerId: number = 0;
  const navigate = useNavigate();

  useEffect(
    () => () => {
      clearTimeout(timerId);
    },
    [timerId]
  );

  const returnTo = () => {
    timerId = Number(
      setTimeout(() => {
        navigate(`/${path}`);
        window.location.reload();
      }, RETURN_HOME_TIMER)
    );
  };

  return returnTo;
};

export default useReturnTo;
