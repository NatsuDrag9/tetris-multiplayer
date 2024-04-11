import GameButton from '@components/GameButton/GameButton';
import './GameArea.scss';
import DisplayLabel from '@components/DisplayLabel/DisplayLabel';
import { StageType } from '@customTypes/gameTypes';
import { STAGE_HEIGHT, STAGE_WIDTH } from '@constants/game';
import TetrominoCell from '@components/TetrominoCell/TetrominoCell';

interface GameAreaPropsType {
  stage: StageType;
  onButtonClick: () => void;
  gameOver: boolean;
  gameScore: number;
  rows: number;
  currentLevel: number;
  gamePaused: boolean;
  gameStarted: boolean;
}

function GameArea({
  stage,
  onButtonClick,
  gameOver,
  gameScore,
  rows,
  currentLevel,
  gamePaused,
  gameStarted,
}: GameAreaPropsType) {
  const handleButtonClick = () => {
    onButtonClick();
  };
  return (
    <div className="game-area">
      <section
        className="game-area__game"
        // Replace this with stage.length and stage[0].length respectively later when stage is defined
        style={{
          '--stageHeight': `${STAGE_HEIGHT}`,
          '--stageWidth': `${STAGE_WIDTH}`,
        }}
      >
        {/* This is where tetrominoes will fall */}
        {stage.map((row) =>
          row.map((cell, x) => {
            return <TetrominoCell key={x} tetrominoType={cell[0]} />;
          })
        )}
      </section>
      <aside className="game-area__info">
        {!gameOver ? (
          <>
            <DisplayLabel
              gameOver={gameOver}
              labelName="Rows: "
              labelContent={rows.toString()}
            />
            <DisplayLabel
              gameOver={gameOver}
              labelName="Level: "
              labelContent={currentLevel.toString()}
            />
            <DisplayLabel
              gameOver={gameOver}
              labelName="Score: "
              labelContent={gameScore.toString()}
            />
            <GameButton
              buttonText={
                !gameStarted
                  ? 'Start Game'
                  : gamePaused
                    ? 'Resume Game'
                    : 'Pause Game'
              }
              onButtonClick={handleButtonClick}
            />
          </>
        ) : (
          <>
            <DisplayLabel
              gameOver={gameOver}
              labelName=""
              labelContent="GAME OVER"
            />
            <GameButton
              buttonText="Restart Game"
              onButtonClick={handleButtonClick}
            />
          </>
        )}
      </aside>
    </div>
  );
}

export default GameArea;
