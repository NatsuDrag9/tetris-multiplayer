interface MultiplayerGameIntroProps {
  buttonOneHandler: () => void;
  buttonTwoHandler: () => void;
}

function MultiplayerGameIntro({
  buttonOneHandler,
  buttonTwoHandler,
}: MultiplayerGameIntroProps) {
  return (
    <section className="intro">
      <h2 className="intro__title">Multiplayer Tetromino Game Rules:</h2>
      <ul className="intro__entry-rules">
        <li className="intro__entry-rules__rule">
          Each player has 30 sec to select a tetromino
        </li>
        <li className="intro__entry-rules__rule">
          If a player exceeds the time limit, they receive a penalty: a random
          piece is generated with a higher fall rate
        </li>
        <li className="intro__entry-rules__rule">Each player has 10 turns</li>
        <li className="intro__entry-rules__rule">
          Game Over Condition:
          <ul className="intro__entry-rules__sub-rules">
            <li className="intro__entry-rules__sub-rule">
              A player reaches their 10-turn limit
            </li>
            <li className="intro__entry-rules__sub-rule">
              A player's game board fills to the top
            </li>
          </ul>
        </li>
        <li className="intro__entry-rules__rule">
          Player with the highest score wins
        </li>
      </ul>
      <div className="intro__generate-code">
        <p className="intro__generate-code__text">
          To enter the game room, one player must generate a code and share it
          with their opponent.
        </p>
        <p className="intro__generate-code__text">What will you do?</p>
        <div className="intro__generate-code__button-group">
          <button
            className="multiplayer-lobby__button"
            onClick={() => buttonOneHandler()}
          >
            Generate Code
          </button>
          <button
            className="multiplayer-lobby__button"
            onClick={() => buttonTwoHandler()}
          >
            Enter friend's code
          </button>
        </div>
      </div>
    </section>
  );
}

export default MultiplayerGameIntro;
