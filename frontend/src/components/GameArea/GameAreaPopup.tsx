import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GameAreaPopupProps {
  rows: number;
  penalties: number;
  score: number;
}

function GameAreaPopup({ rows, penalties, score }: GameAreaPopupProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        returnToHome();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const returnToHome = () => {
    window.location.reload();
    navigate('/home');
  };

  return (
    <div className="game-area__popup">
      <h4 className="title">Summary:</h4>
      <ul className="list">
        <li className="list__item">Rows Cleared: {rows.toString()}</li>
        <li className="list__item">Penalties: {penalties}</li>
        <li className="list__item">Score: {score}</li>
      </ul>
      <p className="score">The winner is: </p>
      <p className="exit">Press ESC to go home</p>
    </div>
  );
}

export default GameAreaPopup;
