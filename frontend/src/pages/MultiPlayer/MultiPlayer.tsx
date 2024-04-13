import GameRoom from '@components/GameRoom/GameRoom';
import './MultiPlayer.scss';
import MultiplayerLobby from '@pages/MultiplayerLobby/MultiplayerLobby';

function MultiPlayer() {
  return (
    <div className="multi-player">
      <GameRoom />
      <GameRoom />
      {/* <MultiplayerLobby /> */}
    </div>
  );
}

export default MultiPlayer;
