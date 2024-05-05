import { TetrominoShape } from '@customTypes/tetromonoTypes';
import { ReactNode, createContext, useContext, useState } from 'react';

interface MultiplayerGameContextProps {
  userSelectedTetromino: TetrominoShape | null;
  setUserSelectedTetromino: (tetromino: TetrominoShape | null) => void;
}

export const MultiplayerGameContext =
  createContext<MultiplayerGameContextProps>({
    userSelectedTetromino: null,
    setUserSelectedTetromino: () => {},
  });

interface MultiplayerGameProviderProps {
  children: ReactNode;
}

export const MultiplayerGameProvider: React.FC<
  MultiplayerGameProviderProps
> = ({ children }) => {
  const [userSelectedTetromino, setUserSelectedTetromino] =
    useState<TetrominoShape | null>(null);

  return (
    <MultiplayerGameContext.Provider
      value={{ userSelectedTetromino, setUserSelectedTetromino }}
    >
      {children}
    </MultiplayerGameContext.Provider>
  );
};

export const useMultiplayerGameContext = () =>
  useContext(MultiplayerGameContext);
