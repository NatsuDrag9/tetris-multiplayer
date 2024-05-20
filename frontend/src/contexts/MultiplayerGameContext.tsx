import {
  CommStatus,
  GameMessage,
  INIITAL_PENALTIES,
  INITIAL_SCORE,
  MAX_TURNS,
  MessageType,
  TurnState,
} from '@constants/game';
import { Player } from '@customTypes/gameTypes';
import { TetrominoShape } from '@customTypes/tetromonoTypes';
import { logInDev } from '@utils/log-utils';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useWebSocketContext } from './WebSocketContext';

interface Turn {
  currentState: TurnState;
  penaltyIncurred: boolean;
}

interface MultiplayerGameContextProps {
  userSelectedTetromino: TetrominoShape | null;
  setUserSelectedTetromino: (tetromino: TetrominoShape | null) => void;
  playerInfo: Player;
  // setInitialPlayerInfo: (newInfo: Player) => void;
  updateScore: (_newValue: number) => void;
  turn: Turn;
  updatePenaltyIncurred: (_newValue: boolean) => void;
  handleTurnStateChange: (_newState: TurnState) => void;
}

export const MultiplayerGameContext =
  createContext<MultiplayerGameContextProps>({
    userSelectedTetromino: null,
    setUserSelectedTetromino: () => {},
    playerInfo: {
      playerName: '',
      turnsRemaining: MAX_TURNS,
      penalties: INIITAL_PENALTIES,
      score: INITIAL_SCORE,
    },
    // setInitialPlayerInfo: (_newInfo: Player) => {},
    updateScore: (_newValue: number) => {},
    turn: {
      currentState: TurnState.SELECT_TETROMINO,
      penaltyIncurred: false,
    },
    updatePenaltyIncurred: (_newValue: boolean) => {},
    handleTurnStateChange: (_newState: TurnState) => {},
  });

interface MultiplayerGameProviderProps {
  children: ReactNode;
}

export const MultiplayerGameProvider: React.FC<
  MultiplayerGameProviderProps
> = ({ children }) => {
  const [userSelectedTetromino, setUserSelectedTetromino] =
    useState<TetrominoShape | null>(null);
  const [playerInfo, setPlayerInfo] = useState<Player>({
    playerName: '',
    turnsRemaining: MAX_TURNS,
    penalties: INIITAL_PENALTIES,
    score: INITIAL_SCORE,
  });
  const [turn, setTurn] = useState<Turn>({
    currentState: TurnState.SELECT_TETROMINO,
    penaltyIncurred: false,
  });
  const { isConnectedToServer, gameRoomDetails, sendMessage } =
    useWebSocketContext();

  useEffect(() => {
    if (isConnectedToServer && gameRoomDetails !== null) {
      setPlayerInfo({
        playerName: gameRoomDetails.player,
        turnsRemaining: MAX_TURNS,
        penalties: INIITAL_PENALTIES,
        score: INITIAL_SCORE,
      });
    }
  }, []);

  // const setInitialPlayerInfo = (newPlayer: Player) => {
  //   setPlayerInfo(newPlayer);
  // };

  const updatePenaltyIncurred = (newValue: boolean) => {
    setTurn((prevTurn) => ({
      ...prevTurn,
      penaltyIncurred: newValue,
    }));
  };

  const updateScore = (newValue: number) => {
    logInDev('score: ', newValue);
    setPlayerInfo((prevState) => {
      return {
        ...prevState,
        score: newValue,
      };
    });
  };

  const increasePenalty = () => {
    setPlayerInfo((prevState) => {
      return {
        ...prevState,
        penalties: prevState.penalties + 1,
      };
    });
  };

  const decrementTurnsRemaining = () => {
    setPlayerInfo((prevState) => {
      return {
        ...prevState,
        turnsRemaining: prevState.turnsRemaining - 1,
      };
    });
  };

  const handleTurnStateChange = (newState: TurnState) => {
    setTurn((prevState) => ({ ...prevState, currentState: newState }));
  };

  useEffect(() => {
    if (turn.currentState === TurnState.SELECT_TETROMINO) {
      // Timer begins in <SelectTetromino /> and state is changed to PLAY_TURN when user clicks USE TETROMINO button or timer expires
      // Nothing else to do here
      logInDev('turn state: select tetromino');
    } else if (turn.currentState === TurnState.PLAY_TURN) {
      // Game resumed with appropriate drop rate in <MultiplayerGameRoom />

      // Increase penalty in playerInfo if penaltyIncurred is true
      if (turn.penaltyIncurred) {
        increasePenalty();
      }
      logInDev('turn state: play turn');

      // State is changed to UPDATE_PLAYER_INFO when collision occurs in usePiece hook
      // Nothing else to do here
    } else if (turn.currentState === TurnState.UPDATE_PLAYER_INFO) {
      logInDev('turn state: update player info');
      // Update turns remaining in playerInfo
      decrementTurnsRemaining();
      handleTurnStateChange(TurnState.SEND_MESSAGE);
      // Nothing else to do here
    } else if (turn.currentState === TurnState.SEND_MESSAGE) {
      // Send message when turnsRemaining = 0 after updating player info
      if (gameRoomDetails !== null) {
        const message = {
          roomId: gameRoomDetails.roomId,
          ...playerInfo,
        };
        logInDev('turn message: ', message);
        if (playerInfo.turnsRemaining === 0) {
          sendMessage({
            messageType: MessageType.GAME_MESSAGE,
            messageName: GameMessage.TURN_INFO,
            isConnectedToServer: isConnectedToServer,
            messageBody: JSON.stringify(message),
            player: gameRoomDetails?.player,
            commStatus: CommStatus.IN_GAME_ROOM,
          });
        }
      }
      handleTurnStateChange(TurnState.END_TURN);
    } else if (turn.currentState === TurnState.END_TURN) {
      // Game paused in <MultiplayerGameRoom />
      // Nothing else to do here
      logInDev(
        'turn state: end turn and turns remaining: ',
        playerInfo.turnsRemaining
      );
      updatePenaltyIncurred(false);
    }
  }, [turn.currentState]);

  return (
    <MultiplayerGameContext.Provider
      value={{
        userSelectedTetromino,
        setUserSelectedTetromino,
        playerInfo,
        // setInitialPlayerInfo,
        updateScore,
        turn,
        updatePenaltyIncurred,
        handleTurnStateChange,
      }}
    >
      {children}
    </MultiplayerGameContext.Provider>
  );
};

export const useMultiplayerGameContext = () =>
  useContext(MultiplayerGameContext);
