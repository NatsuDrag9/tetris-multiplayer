import { TetrominoShape } from '@customTypes/tetromonoTypes';
import { ReactNode, createContext, useContext, useState } from 'react';

interface MultiplayerGameContextProps {
  userSelectedTetromino: TetrominoShape | null;
  setUserSelectedTetromino: (tetromino: TetrominoShape | null) => void;
  timerState: boolean;
  updateTimerState: (state: boolean) => void;
}

export const MultiplayerGameContext =
  createContext<MultiplayerGameContextProps>({
    userSelectedTetromino: null,
    setUserSelectedTetromino: () => {},
    timerState: false,
    updateTimerState: (_state: boolean) => {},
  });

interface MultiplayerGameProviderProps {
  children: ReactNode;
}

export const MultiplayerGameProvider: React.FC<
  MultiplayerGameProviderProps
> = ({ children }) => {
  const [userSelectedTetromino, setUserSelectedTetromino] =
    useState<TetrominoShape | null>(null);
  const [timerState, setTimerState] = useState<boolean>(false);

  const updateTimerState = (state: boolean) => {
    setTimerState(state);
  };

  return (
    <MultiplayerGameContext.Provider
      value={{
        userSelectedTetromino,
        setUserSelectedTetromino,
        timerState,
        updateTimerState,
      }}
    >
      {children}
    </MultiplayerGameContext.Provider>
  );
};

export const useMultiplayerGameContext = () =>
  useContext(MultiplayerGameContext);
