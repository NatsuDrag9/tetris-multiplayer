'use client';

import './home.scss';
import { useWebSocketContext } from '@contexts/WebSocketContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Home() {
  const router = useRouter();
  const { clientId, closeWSConnection } = useWebSocketContext();

  useEffect(() => {
    // Close the connection if clientId exists and redirected to /home
    if (clientId) {
      closeWSConnection();
    }
    // Disabled rule as no dependency is required here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSinglePlayerClick = () => {
    router.push('/singleplayer');
  };

  const handleMultiPlayerClick = () => {
    router.push('/multiplayer-clientid');
  };
  return (
    <main className="home">
      <h3 className="home__title">
        Welcome to Tetris Arcade. Select game mode:
      </h3>
      <div className="home__body">
        <button onClick={handleSinglePlayerClick}>Single Player</button>
        <button onClick={handleMultiPlayerClick}>Multi Player</button>
      </div>
    </main>
  );
}

export default Home;
