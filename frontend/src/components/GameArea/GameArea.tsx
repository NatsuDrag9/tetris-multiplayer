import GameButton from '@components/GameButton/GameButton';
import './GameArea.scss';
import DisplayLabel from '@components/DisplayLabel/DisplayLabel';
import { StageType } from '@customTypes/gameTypes';
import { STAGE_HEIGHT, STAGE_WIDTH } from '@constants/game';
import TetrominoCell from '@components/TetrominoCell/TetrominoCell';
import SelectTetromino from '@components/SelectTetromino/SelectTetromino';
import { useMultiplayerGameContext } from '@contexts/MultiplayerGameContext';
import GameAreaPopup from '@components/GameArea/GameAreaPopup';

interface GameAreaPropsType {
  stage: StageType;
  onButtonClick?: () => void;
  gameOver: boolean;
  gameScore: number;
  rows: number;
  currentLevel: number;
  gamePaused?: boolean;
  gameStarted?: boolean;
  isMultiplayer?: boolean;
  // onTetrominoSelect?: (tetromino: TetrominoShape) => void;
  // onTimerEnded?: (ended: boolean) => void;
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
  isMultiplayer,
  // onTetrominoSelect,
  // onTimerEnded,
}: GameAreaPropsType) {
  const { playerInfo } = useMultiplayerGameContext();
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  // const handleTimerEnded = (ended: boolean) => {
  //   if (onTimerEnded) {
  //     onTimerEnded(ended);
  //   }
  // };

  const renderGameInfo = () => {
    if (isMultiplayer) {
      return (
        <aside className="game-area__info">
          {!gameOver ? (
            <>
              <SelectTetromino
              // onSelectedTetromino={onTetrominoSelect}
              // onTimerEnd={handleTimerEnded}
              />
              <DisplayLabel
                gameOver={gameOver}
                labelName="Rows: "
                labelContent={(rows / 2).toString()}
              />
              <DisplayLabel
                gameOver={gameOver}
                labelName="Turns Left: "
                labelContent={playerInfo.turnsRemaining.toString()}
              />
              <DisplayLabel
                gameOver={gameOver}
                labelName="Score: "
                labelContent={gameScore.toString()}
              />
            </>
          ) : (
            <>
              <DisplayLabel
                gameOver={gameOver}
                labelName=""
                labelContent="YOU FINISHED YOUR TURNS"
              />
            </>
          )}
        </aside>
      );
    }
    return (
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
    );
  };

  return (
    <div className="game-area">
      {isMultiplayer && gameOver ? (
        <div className="game-area__popup-wrapper">
          <GameAreaPopup
            rows={rows / 2}
            penalties={playerInfo.penalties}
            score={playerInfo.score}
          />
        </div>
      ) : (
        <>
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
          {renderGameInfo()}
        </>
      )}
    </div>
  );
}

export default GameArea;

GameArea.defaultProps = {
  isMultiplayer: false,
  // onTimerEnded: (_ended: boolean) => {},
  // onTetrominoSelect: () => {},
  gamePaused: false,
  gameStarted: false,
  onButtonClick: () => {},
};
