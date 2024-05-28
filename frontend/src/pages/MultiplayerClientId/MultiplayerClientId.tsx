import toast, { Toaster } from 'react-hot-toast';
import './MultiplayerClientId.scss';
import { fetchClientId } from '@services/multiPlayer';
import { useState } from 'react';
import LoadingOverlay from 'react-loading-overlay-ts';
import { AxiosError } from 'axios';
import { useWebSocketContext } from '@contexts/WebSocketContext';
import { useNavigate } from 'react-router-dom';

function MultiplayerClientId() {
  const [loading, setLoading] = useState<boolean>(false);
  const { clientId, setClientId } = useWebSocketContext();
  const navigate = useNavigate();

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
          toast.error(
            err.response.data.error ||
              'An error occurred when generating client id'
          );
        }
        setClientId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="multiplayer-clientid">
      <Toaster />
      <h2 className="title">Ticket Counter</h2>
      {clientId !== null ? (
        <LoadingOverlay active={loading} spinner>
          <div className="display">
            <p className="display__text">Your ticket: {clientId}</p>

            <p className="display__note">
              This ticket is used internally. You don't need to do anything.
            </p>

            <button
              type="button"
              className="button display__button"
              onClick={() => {
                navigate('/multiplayer-lobby');
                window.location.reload();
              }}
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
        >
          Get Your ticket
        </button>
      )}
    </div>
  );
}

export default MultiplayerClientId;
