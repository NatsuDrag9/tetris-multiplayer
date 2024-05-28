import { useNavigate } from 'react-router-dom';
import './Home.scss';

function Home() {
  const navigate = useNavigate();
  const handleSinglePlayerClick = () => {
    navigate('/singleplayer');
  };

  const handleMultiPlayerClick = () => {
    navigate('/multiplayer-clientid');
  };
  return (
    <div className="home">
      <h3 className="home__title">
        Welcome to Tetris Arcade. Select game mode:
      </h3>
      <div className="home__body">
        <button onClick={handleSinglePlayerClick}>Single Player</button>
        <button onClick={handleMultiPlayerClick}>Multi Player</button>
      </div>
    </div>
  );
}

export default Home;
