import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Home from '@pages/Home/Home';
import SinglePlayer from '@pages/SinglePlayer/SinglePlayer';
import { WebSocketProvider } from './contexts/WebSocketContext';
import MultiplayerClientId from '@pages/MultiplayerClientId/MultiplayerClientId';
import {
  ProtectedMultiplayerGameRoom,
  ProtectedMultiplayerLobby,
} from '@pages/ProtectedPages/ProtectedPages';

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
          <Route
            path="/multiplayer-lobby"
            element={<ProtectedMultiplayerLobby />}
          />
          <Route
            path="/multiplayer"
            element={<ProtectedMultiplayerGameRoom />}
          />
        </Routes>
      </WebSocketProvider>
    </div>
  );
}

export default App;
