import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Home from '@pages/Home/Home';
import MultiPlayer from '@pages/MultiPlayer/MultiPlayer';
import SinglePlayer from '@pages/SinglePlayer/SinglePlayer';
import MultiplayerLobby from '@pages/MultiplayerLobby/MultiplayerLobby';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/multiplayer-lobby" element={<MultiplayerLobby />} />
        <Route path="/multiplayer" element={<MultiPlayer />} />
        <Route path="/singleplayer" element={<SinglePlayer />} />
      </Routes>
    </div>
  );
}

export default App;
