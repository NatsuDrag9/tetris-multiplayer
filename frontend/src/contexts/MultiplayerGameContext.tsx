import { Player } from '@customTypes/gameTypes';
import { TetrominoShape } from '@customTypes/tetromonoTypes';
import { ReactNode, createContext, useContext, useState } from 'react';

interface TurnTask {
  startTimer: boolean;
  stopTimer: boolean;
  penaltyIncurred: boolean;
}

interface MultiplayerGameContextProps {
  userSelectedTetromino: TetrominoShape | null;
  setUserSelectedTetromino: (tetromino: TetrominoShape | null) => void;
  playerInfo: Player | null;
  setInitialPlayerInfo: (newInfo: Player) => void;
  updateScore: (_newValue: number) => void;
  increasePenalty: () => void;
  updateTurnsRemaining: (_newValue: number) => void;
  turnTask: TurnTask;
  updateStartTimer: (_newValue: boolean) => void;
  updatePenaltyIncurred: (_newValue: boolean) => void;
  updateStopTimer: (_newValue: boolean) => void;
}

export const MultiplayerGameContext =
  createContext<MultiplayerGameContextProps>({
    userSelectedTetromino: null,
    setUserSelectedTetromino: () => {},
    playerInfo: null,
    setInitialPlayerInfo: (_newInfo: Player) => {},
    updateScore: (_newValue: number) => {},
    increasePenalty: () => {},
    updateTurnsRemaining: (_newValue: number) => {},
    turnTask: {
      startTimer: false,
      stopTimer: false,
      penaltyIncurred: false,
    },
    updateStartTimer: (_newValue: boolean) => {},
    updatePenaltyIncurred: (_newValue: boolean) => {},
    updateStopTimer: (_newValue: boolean) => {},
  });

interface MultiplayerGameProviderProps {
  children: ReactNode;
}

export const MultiplayerGameProvider: React.FC<
  MultiplayerGameProviderProps
> = ({ children }) => {
  const [userSelectedTetromino, setUserSelectedTetromino] =
    useState<TetrominoShape | null>(null);
  const [playerInfo, setPlayerInfo] = useState<Player | null>(null);
  const [turnTask, setTurnTask] = useState<TurnTask>({
    startTimer: false,
    stopTimer: false,
    penaltyIncurred: false,
  });

  const setInitialPlayerInfo = (newPlayer: Player) => {
    setPlayerInfo(newPlayer);
  };

  const updateScore = (newValue: number) => {
    setPlayerInfo((prevState) => {
      if (prevState !== null) {
        return {
          ...prevState,
          score: newValue,
        };
      }
      return null;
    });
  };

  const increasePenalty = () => {
    setPlayerInfo((prevState) => {
      if (prevState !== null) {
        return {
          ...prevState,
          penalties: prevState.penalties + 1,
        };
      }
      return null;
    });
  };

  const updateTurnsRemaining = (newValue: number) => {
    setPlayerInfo((prevState) => {
      if (prevState !== null) {
        return {
          ...prevState,
          turnsRemaining: newValue,
        };
      }
      return null;
    });
  };

  const updateStartTimer = (newValue: boolean) => {
    setTurnTask((prevState) => ({
      ...prevState,
      startTimer: newValue,
    }));
  };

  const updateStopTimer = (newValue: boolean) => {
    setTurnTask((prevState) => ({
      ...prevState,
      stopTimer: newValue,
    }));
  };

  const updatePenaltyIncurred = (newValue: boolean) => {
    setTurnTask((prevState) => ({
      ...prevState,
      penaltyIncurred: newValue,
    }));
  };

  return (
    <MultiplayerGameContext.Provider
      value={{
        userSelectedTetromino,
        setUserSelectedTetromino,
        playerInfo,
        setInitialPlayerInfo,
        increasePenalty,
        updateScore,
        updateTurnsRemaining,
        turnTask,
        updatePenaltyIncurred,
        updateStartTimer,
        updateStopTimer,
      }}
    >
      {children}
    </MultiplayerGameContext.Provider>
  );
};

export const useMultiplayerGameContext = () =>
  useContext(MultiplayerGameContext);
