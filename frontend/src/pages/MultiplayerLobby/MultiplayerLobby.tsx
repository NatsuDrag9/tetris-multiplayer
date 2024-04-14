import './MultiplayerLobby.scss';
import { useEffect, useState } from 'react';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import fetchRandomCode from '@services/multiPlayer';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import validateRoomCode from '@utils/validateRoomCode';
import useWebSocket from '@hooks/useWebSocket';
import { GameCommMode } from '@constants/game';

function MultiplayerLobby() {
  const [code, setCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState<string>('');
  // const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { messages, sendMessage } = useWebSocket();
  const [generatesCode, setGeneratesCode] = useState<boolean | null>(null);

  useEffect(() => {
    // Navigation for client that selects "GENERATE_CODE"
    logInDev(messages);
    messages.forEach((message) => {
      if (message.type === GameCommMode.JOIN_GAME_ROOM) {
        if (message.body === 'ready') {
          navigate('/multiplayer');
        }
      }
    });
  }, [messages, generatesCode, navigate]);

  const generateRandomCode = async () => {
    setGeneratesCode(true);
    // setLoading(true);
    try {
      const response = await fetchRandomCode();
      if (response) {
        // toast.success('Got code');
        sendMessage({ type: GameCommMode.CODE, body: response.code });
        setCode(response.code);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          logErrorInDev(
            err.response.data.error ||
              'An error occurred when fetching the code'
          );
          // toast.error(
          //   err.response.data.error ||
          //     'An error occurred when fetching the code'
          // );
        }
      }
    } finally {
      // setLoading(false);
    }
  };

  const handleJoinGameRoom = () => {
    logInDev(enteredCode, code);
    const errorMessage = validateRoomCode(enteredCode, code);

    if (errorMessage) {
      logErrorInDev(errorMessage);
    } else {
      // Navigation for client that selects "ENTER_CODE"
      sendMessage({ type: GameCommMode.JOIN_GAME_ROOM, body: 'ready' });
      navigate('/multiplayer');
    }
  };

  const handleEnterFriendCode = () => {
    setGeneratesCode(false);
    messages.forEach((message) => {
      if (message.type === GameCommMode.ENTER_CODE) {
        setCode(message.body);
      }
    });
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="multiplayer-lobby">
      {/* <Toaster /> */}
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
            <div className="code-wrapper">
              <h3 className="title">Share this code with your friend!</h3>
              <p className="code">{code}</p>
            </div>
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
