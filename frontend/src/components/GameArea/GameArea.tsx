import GameButton from '@components/GameButton/GameButton';
import './GameArea.scss';
import { logInDev } from '@utils/log-utils';
import DisplayLabel from '@components/DisplayLabel/DisplayLabel';

function GameArea() {
  const handleStartGame = () => {
    logInDev('Game started...');
  };
  return (
    <div className="game-area">
      <div className="game-area__game">This is where tetrominoes will fall</div>
      <div className="game-area__info">
        {/* <p>Game information is displayed</p> */}
        <DisplayLabel labelName="Rows: " labelContent="0" />
        <DisplayLabel labelName="Score: " labelContent="0" />
        <GameButton buttonText="Start Game" onButtonClick={handleStartGame} />
      </div>
    </div>
  );
}

export default GameArea;
