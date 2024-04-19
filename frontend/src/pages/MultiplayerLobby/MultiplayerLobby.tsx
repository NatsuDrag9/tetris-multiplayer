import './MultiplayerLobby.scss';
import { useEffect, useState } from 'react';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import fetchRandomCode from '@services/multiPlayer';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import validateRoomCode from '@utils/validateRoomCode';
import useWebSocket from '@hooks/useWebSocket';
import {
  CommStatus,
  CommStatusCheck,
  MessageType,
  NO_PLAYER,
  NavigationCodes,
  PLAYER_ONE,
  PLAYER_TWO,
} from '@constants/game';
import { WebSocketMessage } from '@customTypes/gameTypes';
import navigateToMultiplayer from '@utils/navigateToMultiplayer';
import wsCommStatusCheck from '@utils/wsCommStatusCheck';
import useGameRoom from '@hooks/useGameRoom';
import toast, { Toaster } from 'react-hot-toast';
import LoadingOverlay from 'react-loading-overlay-ts';

function MultiplayerLobby() {
  const [code, setCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { messages, sendMessage } = useWebSocket();
  const { updateGameRoomDetails } = useGameRoom();
  const [generatesCode, setGeneratesCode] = useState<boolean | null>(null);

  useEffect(() => {
    // Navigate player one (client that selects "GENERATE_CODE") to the game room
    logInDev(messages);
    messages.forEach((message) => {
      if (message.isConnectedToServer) {
        if (message.messageType === MessageType.BROADCAST_CODE) {
          setCode(message.messageBody);
        } else {
          const navigationCheck = navigateToMultiplayer(message);
          if (navigationCheck === NavigationCodes.YES) {
            updateGameRoomDetails(
              message.messageBody,
              message.player === PLAYER_ONE ? code : enteredCode,
              message.player
            );
            navigate('/multiplayer');
          } else if (navigationCheck === NavigationCodes.NO) {
            // Render a popup/message showing game room unavailable
          } else {
            // Render a popup/message displaying the error
          }
        }
      } else {
        logErrorInDev('Lost communication with server');
      }
    });
  }, [messages, navigate]);

  const generateRandomCode = async () => {
    setGeneratesCode(true);
    setLoading(true);
    try {
      const response = await fetchRandomCode();
      if (response) {
        toast.success('Got code');
        if (
          wsCommStatusCheck(messages, NO_PLAYER) ===
          CommStatusCheck.PLAYER_TO_BE_ASSIGNED
        ) {
          // Send a message only if this client is connected to the server
          const playerOneMessage: WebSocketMessage = {
            messageType: MessageType.BROADCAST_CODE,
            isConnectedToServer: true,
            messageBody: response.code,
            player: PLAYER_ONE,
            commStatus: CommStatus.IN_LOBBY,
          };
          sendMessage(playerOneMessage);
        }

        setCode(response.code);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          logErrorInDev(
            err.response.data.error ||
              'An error occurred when fetching the code'
          );
          toast.error(
            err.response.data.error ||
              'An error occurred when fetching the code'
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGameRoom = () => {
    logInDev(enteredCode, code);
    // Validate enteredCode
    const errorMessage = validateRoomCode(enteredCode, code);

    if (errorMessage) {
      logErrorInDev(errorMessage);
    } else {
      // Send message on successful validation
      const playerTwoMessage: WebSocketMessage = {
        messageType: MessageType.READY_TO_JOIN_GAME_ROOM,
        messageBody: enteredCode,
        player: PLAYER_TWO,
        commStatus: CommStatus.IN_LOBBY,
        isConnectedToServer: true,
      };
      sendMessage(playerTwoMessage);
      // navigate('/multiplayer');
    }
  };

  const handleEnterFriendCode = () => {
    setGeneratesCode(false);
    if (
      wsCommStatusCheck(messages, NO_PLAYER) ===
      CommStatusCheck.PLAYER_TO_BE_ASSIGNED
    ) {
      // Send a message only if this client is connected to the server
      const playerTwoMessage: WebSocketMessage = {
        messageType: MessageType.WAITING_FOR_CODE,
        isConnectedToServer: true,
        messageBody: 'Waiting for the code',
        player: PLAYER_TWO,
        commStatus: CommStatus.IN_LOBBY,
      };
      sendMessage(playerTwoMessage);
    }
  };

  return (
    <div className="multiplayer-lobby">
      <Toaster />
      {/* {error && <div>{error}</div>} */}
      {generatesCode === null ? (
        <section className="intro">
          <h2 className="intro__title">Multiplayer Tetromino Game Rules:</h2>
          <ul className="intro__entry-rules">
            <li className="intro__entry-rules__rule">
              Each player has 30 sec to select a tetromino
            </li>
            <li className="intro__entry-rules__rule">
              If a player exceeds the time limit, they receive a penalty: a
              random piece is generated with a higher fall rate
            </li>
            <li className="intro__entry-rules__rule">
              Each player has 10 turns
            </li>
            <li className="intro__entry-rules__rule">
              Game Over Condition:
              <ul className="intro__entry-rules__sub-rules">
                <li className="intro__entry-rules__sub-rule">
                  A player reaches their 10-turn limit
                </li>
                <li className="intro__entry-rules__sub-rule">
                  A player's game board fills to the top
                </li>
              </ul>
            </li>
            <li className="intro__entry-rules__rule">
              Player with the highest score wins
            </li>
          </ul>
          <div className="intro__generate-code">
            <p className="intro__generate-code__text">
              To enter the game room, one player must generate a code and share
              it with their opponent.
            </p>
            <p className="intro__generate-code__text">What will you do?</p>
            <div className="intro__generate-code__button-group">
              <button
                className="multiplayer-lobby__button"
                onClick={generateRandomCode}
              >
                Generate Code
              </button>
              <button
                className="multiplayer-lobby__button"
                onClick={handleEnterFriendCode}
              >
                Enter friend's code
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="multiplayer-lobby__display">
          {generatesCode === true ? (
            <LoadingOverlay active={loading} spinner>
              <div className="code-wrapper">
                <h3 className="title">Share this code with your friend!</h3>
                <p className="code">{code}</p>
              </div>
            </LoadingOverlay>
          ) : code ? (
            <div className="input-wrapper">
              <h3 className="title">Enter friend's code</h3>
              <input
                type="text"
                placeholder="Enter friend's code"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
              />
              <button
                className="multiplayer-lobby__button"
                onClick={handleJoinGameRoom}
              >
                Join Game Room
              </button>
            </div>
          ) : (
            <section className="multiplayer__display">
              <p>Please wait...</p>
            </section>
          )}
        </section>
      )}
    </div>
  );
}

export default MultiplayerLobby;
