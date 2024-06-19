import './MultiplayerLobby.scss';
import { useEffect, useRef, useState } from 'react';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import { fetchRandomCode } from '@services/multiPlayer';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import validateRoomCode from '@utils/validate-room-code';
import {
  CODE_TIMEOUT,
  CommMessage,
  CommStatus,
  CommStatusCheck,
  MessageType,
  NO_PLAYER,
  NavigationCodes,
  PLAYER_ONE,
  PLAYER_TWO,
  RETURN_HOME_TIMER,
} from '@constants/game';
import { WebSocketMessage } from '@customTypes/gameTypes';
import navigateToMultiplayer from '@utils/navigate-to-multiplayer';
import wsCommStatusCheck from '@utils/ws-comm-status-check';
import toast, { Toaster } from 'react-hot-toast';
import LoadingOverlay from 'react-loading-overlay-ts';
import { useWebSocketContext } from '@contexts/WebSocketContext';
import wsErrorMessageHandler from '@utils/ws-error-message-handler';
import Timer from '@components/Timer/Timer';
import MultiplayerGameIntro from './MultiplayerGameIntro';
import toastOptions from '@constants/misc';

function MultiplayerLobby() {
  let homeTimerId: number = 0;
  const [code, setCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    openWSConnection,
    isConnectedToServer,
    commMessages,
    errorMessages,
    sendMessage,
    setCurrentPlayer,
    updateGameRoomDetails,
  } = useWebSocketContext();
  const [generatesCode, setGeneratesCode] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCodeInvalid, setIsCodeInvalid] = useState<boolean>(false);

  useEffect(() => {
    inputRef.current?.focus();
    openWSConnection();
  }, []);

  useEffect(() => {
    // Navigate player one (client that selects "GENERATE_CODE") to the game room
    logInDev(commMessages, errorMessages);
    if (!isConnectedToServer) {
      wsErrorMessageHandler(errorMessages, returnToHome);
    }
    commMessages.forEach((message) => {
      if (message.messageName === CommMessage.BROADCAST_CODE) {
        setCode(message.messageBody);
      } else {
        const navigationCheck = navigateToMultiplayer(message);
        if (navigationCheck === NavigationCodes.YES) {
          updateGameRoomDetails(
            message.messageBody,
            message.player === PLAYER_ONE ? code : enteredCode
          );
          navigate('/multiplayer');
        } else if (navigationCheck === NavigationCodes.NO) {
          // Render a popup/message showing game room unavailable
          toast(
            ` ${message.messageBody} Please try again later! \n\n Returning to home page.`
          );
          setLoading(true);
          returnToHome();
        }
        //  else if (navigationCheck === NavigationCodes.ERR) {
        //   // Render a popup/message displaying the error
        //   toast.error(
        //     `An error occurred when assigning game room.\n\n Returning to home page.`
        //   );
        //   setLoading(true);
        // returnToHome();
        // }
      }
    });

    return () => {
      clearTimeout(homeTimerId);
    };
  }, [commMessages, errorMessages, navigate, isConnectedToServer]);

  const returnToHome = () => {
    homeTimerId = Number(
      setTimeout(() => {
        navigate('/home');
        window.location.reload();
      }, RETURN_HOME_TIMER)
    );
    setLoading(false);
  };

  const generateRandomCode = async () => {
    setGeneratesCode(true);
    setLoading(true);
    try {
      const response = await fetchRandomCode();
      if (response) {
        toast.success('Successfully generated code');
        const commStatusCheck = wsCommStatusCheck(
          commMessages,
          NO_PLAYER,
          isConnectedToServer
        );
        if (commStatusCheck === CommStatusCheck.PLAYER_TO_BE_ASSIGNED) {
          // Send a message only if this client is connected to the server
          const playerOneMessage: WebSocketMessage = {
            messageType: MessageType.COMM_MESSAGE,
            messageName: CommMessage.BROADCAST_CODE,
            isConnectedToServer: true,
            messageBody: response.code,
            player: PLAYER_ONE,
            commStatus: CommStatus.IN_LOBBY,
          };
          sendMessage(playerOneMessage);
          setCode(response.code);
          setCurrentPlayer(PLAYER_ONE);
          setIsCodeInvalid(false);
          // Start a 120 sec timer here. If PLAYER_TWO fails to enter the code within 120 sec,
          // ask PLAYER_ONE to regenerate code
        } else if (
          commStatusCheck === CommStatusCheck.PLAYER_ONE_IS_DISCONNECTED
        ) {
          toast.error('You are not connected to the server. Returning to home');
          returnToHome();
        } else if (commStatusCheck === CommStatusCheck.MESSAGE_DOES_NOT_EXIST) {
          toast.error('Server did not respond. Returning to home');
          returnToHome();
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          // Server responded with an error status code (4xx or 5xx)
          logErrorInDev(
            err.response.data.error ||
              'An error occurred when fetching the code'
          );
          toast.error(
            err.response.data.error ||
              'An error occurred when fetching the code'
          );
        } else if (err.request) {
          // The request was made but no response was received
          logErrorInDev('Error: Server is offline or unreachable');
          toast.error('Error: Server is offline or unreachable');
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
      toast.error(errorMessage);
      logErrorInDev(errorMessage);
    } else {
      // Send message on successful validation
      const playerTwoMessage: WebSocketMessage = {
        messageType: MessageType.COMM_MESSAGE,
        messageName: CommMessage.READY_TO_JOIN_GAME_ROOM,
        messageBody: enteredCode,
        player: PLAYER_TWO,
        commStatus: CommStatus.IN_LOBBY,
        isConnectedToServer: true,
      };
      sendMessage(playerTwoMessage);
    }
  };

  const handleEnterFriendCode = () => {
    setGeneratesCode(false);
    const commStatusCheck = wsCommStatusCheck(
      commMessages,
      NO_PLAYER,
      isConnectedToServer
    );
    if (commStatusCheck === CommStatusCheck.PLAYER_TO_BE_ASSIGNED) {
      // Send a message only if this client is connected to the server
      const playerTwoMessage: WebSocketMessage = {
        messageType: MessageType.COMM_MESSAGE,
        messageName: CommMessage.WAITING_FOR_CODE,
        isConnectedToServer: true,
        messageBody: 'Waiting for the code',
        player: PLAYER_TWO,
        commStatus: CommStatus.IN_LOBBY,
      };
      sendMessage(playerTwoMessage);
      setCurrentPlayer(PLAYER_TWO);
      setIsCodeInvalid(false);
    } else if (commStatusCheck === CommStatusCheck.PLAYER_TWO_IS_DISCONNECTED) {
      toast.error('You are not connected to the server. Returning to home');
      returnToHome();
    } else if (commStatusCheck === CommStatusCheck.MESSAGE_DOES_NOT_EXIST) {
      toast.error('Server did not respond. Returning to home');
      returnToHome();
    }
  };

  const handleTimerEnd = (ended: boolean) => {
    setIsCodeInvalid(ended);
  };

  const handleRegenerateCode = async () => {
    setIsCodeInvalid(false);
    await generateRandomCode();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleJoinGameRoom();
    }
  };

  const renderCode = () => {
    if (isCodeInvalid) {
      return (
        <>
          <h3 className="title">Code Expired</h3>
          <button
            className="multiplayer-lobby__button regenerate-code"
            onClick={handleRegenerateCode}
          >
            Regenerate Code
          </button>
        </>
      );
    }
    return (
      <>
        <Timer timerValue={CODE_TIMEOUT} onTimerEnd={handleTimerEnd} />
        <h3 className="title">
          Share this code with your friend before time runs out!
        </h3>
        <p className="code">{code}</p>
      </>
    );
  };

  const handleNavigateToHome = () => {
    navigate('/home');
  };

  return (
    <div className="multiplayer-lobby">
      <Toaster toastOptions={toastOptions} />
      {/* {error && <div>{error}</div>} */}
      {generatesCode === null ? (
        <MultiplayerGameIntro
          buttonOneHandler={generateRandomCode}
          buttonTwoHandler={handleEnterFriendCode}
        />
      ) : (
        <section className="multiplayer-lobby__display">
          {generatesCode === true ? (
            <LoadingOverlay active={loading} spinner>
              <div className={`code-wrapper ${isCodeInvalid ? 'error' : ''}`}>
                {renderCode()}
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
                ref={inputRef}
                onKeyDown={handleKeyPress}
              />
              <button
                className="multiplayer-lobby__button"
                onClick={handleJoinGameRoom}
              >
                Join Game Room
              </button>
            </div>
          ) : (
            <section className="error-wrapper">
              <p className="error__message">
                Couldn't find code. Going back home
              </p>
              <button
                className="multiplayer-lobby__button home"
                onClick={handleNavigateToHome}
              >
                Home
              </button>
            </section>
          )}
        </section>
      )}
    </div>
  );
}

export default MultiplayerLobby;
