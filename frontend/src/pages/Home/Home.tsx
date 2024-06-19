import { useNavigate } from 'react-router-dom';
import './Home.scss';
import { useWebSocketContext } from '@contexts/WebSocketContext';
import { useEffect } from 'react';

function Home() {
  const { clientId, closeWSConnection } = useWebSocketContext();
  const navigate = useNavigate();
  useEffect(() => {
    // Close the connection if clientId exists and redirected to /home
    if (clientId) {
      closeWSConnection();
    }
  }, []);

  const handleSinglePlayerClick = () => {
    navigate('/singleplayer');
  };

  const handleMultiPlayerClick = () => {
    navigate('/multiplayer-clientid');
  };
  return (
    <div className="home">
      <h3 className="home__title">
        Welcome to Tetris Arcade. Select game mode:
      </h3>
      <div className="home__body">
        <button onClick={handleSinglePlayerClick}>Single Player</button>
        <button onClick={handleMultiPlayerClick}>Multi Player</button>
      </div>
    </div>
  );
}

export default Home;
