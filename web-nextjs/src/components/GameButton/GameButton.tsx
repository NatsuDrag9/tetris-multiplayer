import './GameButton.scss';

interface GameButtonPropsType {
  buttonText: string;
  onButtonClick: () => void;
  buttonTestId: string;
}

function GameButton({
  buttonText,
  onButtonClick,
  buttonTestId,
}: GameButtonPropsType) {
  const handleButtonClick = () => {
    onButtonClick();
  };
  return (
    <button
      data-testid={buttonTestId}
      onClick={handleButtonClick}
      className="game-button"
    >
      {buttonText}
    </button>
  );
}

export default GameButton;
