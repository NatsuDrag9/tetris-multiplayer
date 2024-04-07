import './GameButton.scss';

interface GameButtonPropsType {
  buttonText: string;
  onButtonClick: () => void;
}

function GameButton({ buttonText, onButtonClick }: GameButtonPropsType) {
  const handleButtonClick = () => {
    onButtonClick();
  };
  return (
    <button onClick={handleButtonClick} className="game-button">
      {buttonText}
    </button>
  );
}

export default GameButton;
