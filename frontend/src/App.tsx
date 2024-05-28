import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Home from '@pages/Home/Home';
import SinglePlayer from '@pages/SinglePlayer/SinglePlayer';
import MultiplayerLobby from '@pages/MultiplayerLobby/MultiplayerLobby';
import { WebSocketProvider } from './contexts/WebSocketContext';
import MultiPlayerGameRoom from '@pages/MultiPlayerGameRoom/MultiPlayerGameRoom';
import { MultiplayerGameProvider } from '@contexts/MultiplayerGameContext';
import MultiplayerClientId from '@pages/MultiplayerClientId/MultiplayerClientId';

function App() {
  return (
    <div className="app">
      <WebSocketProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/singleplayer" element={<SinglePlayer />} />
          <Route
            path="/multiplayer-clientid"
            element={<MultiplayerClientId />}
          />
          <Route path="/multiplayer-lobby" element={<MultiplayerLobby />} />
          <Route
            path="/multiplayer"
            element={
              <MultiplayerGameProvider>
                <MultiPlayerGameRoom />
              </MultiplayerGameProvider>
            }
          />
        </Routes>
      </WebSocketProvider>
    </div>
  );
}

export default App;
