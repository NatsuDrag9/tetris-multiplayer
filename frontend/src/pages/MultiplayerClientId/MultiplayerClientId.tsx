import toast, { Toaster } from 'react-hot-toast';
import './MultiplayerClientId.scss';
import { fetchClientId } from '@services/multiPlayer';
import { useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { AxiosError } from 'axios';
import { useWebSocketContext } from '@contexts/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import { logErrorInDev } from '@utils/log-utils';
import useReturnTo from '@hooks/useReturnTo';
import toastOptions from '@constants/misc';

function MultiplayerClientId() {
  const [loading, setLoading] = useState<boolean>(false);
  const { clientId, setClientId } = useWebSocketContext();
  const navigate = useNavigate();
  const returnToHome = useReturnTo('home');

  const handleGenerateClientId = async () => {
    setLoading(true);
    try {
      const response = await fetchClientId();
      if (response) {
        setClientId(response.clientId);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          // Server responded with an error status code (4xx or 5xx)
          logErrorInDev('Error generating client id: ', err);
          toast.error(
            err.response.data.error ||
              'An error occurred when generating client id.'
          );
        } else if (err.request) {
          // The request was made but no response was received
          logErrorInDev('Server is offline or unreachable');
          toast.error('Server is offline or unreachable');
          returnToHome();
        }
        setClientId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="multiplayer-clientid">
      <Toaster toastOptions={toastOptions} />
      <h2 className="title">Ticket Counter</h2>
      {loading && <LoadingOverlay active={loading} spinner></LoadingOverlay>}
      {clientId !== null ? (
        <LoadingOverlay active={loading} spinner>
          <div className="display">
            <p className="display__text" data-testid="display-ticket">
              Your ticket: {clientId}
            </p>

            <p className="display__note">
              This ticket is used internally. You don't need to do anything.
            </p>

            <button
              type="button"
              className="button display__button"
              onClick={() => {
                navigate('/multiplayer-lobby');
                // window.location.reload();
              }}
              data-testid="go-to-lobby"
            >
              Go to Lobby
            </button>
          </div>
        </LoadingOverlay>
      ) : (
        <button
          type="button"
          className="clientid button"
          onClick={handleGenerateClientId}
          data-testid="get-ticket"
        >
          Get Your ticket
        </button>
      )}
    </div>
  );
}

export default MultiplayerClientId;
