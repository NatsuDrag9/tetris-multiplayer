import './MultiplayerLobby.scss';
import { useState } from 'react';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import fetchRandomCode from '@services/multiPlayer';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import validateRoomCode from '@utils/validateRoomCode';

function MultiplayerLobby() {
  const [code, setCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const naviate = useNavigate();

  const generateRandomCode = async () => {
    setLoading(true);
    try {
      const response = await fetchRandomCode();
      if (response) {
        // toast.success('Got code');
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
    const errorMessage = validateRoomCode(enteredCode, code);

    if (errorMessage) {
      logErrorInDev(errorMessage);
    } else {
      naviate('/multiplayer');
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="multiplayer-lobby">
      {/* <Toaster /> */}
      {/* {error && <div>{error}</div>} */}

      {!code ? (
        <button className="generate-code" onClick={generateRandomCode}>
          Generate Code
        </button>
      ) : (
        <div className="multiplayer-lobby__code-wrapper">
          <h3 className="title">Share this code with your friend</h3>
          <p className="code">{code}</p>
          <input
            type="text"
            placeholder="Enter friend's code"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
          />
          <button onClick={handleJoinGameRoom}>Join Game Room</button>
        </div>
      )}
    </div>
  );
}

export default MultiplayerLobby;
