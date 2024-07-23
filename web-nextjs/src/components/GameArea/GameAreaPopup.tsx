import { CommStatus, GameMessage, MessageType } from "@constants/game";
import { useWebSocketContext } from "@contexts/WebSocketContext";
import { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';

interface GameAreaPopupProps {
  rows: number;
  penalties: number;
  score: number;
}

function GameAreaPopup({ rows, penalties, score }: GameAreaPopupProps) {
  // const navigate = useNavigate();
  const { gameRoomDetails, sendMessage, gameMessages } = useWebSocketContext();
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    if (gameRoomDetails !== null) {
      sendMessage({
        messageType: MessageType.GAME_MESSAGE,
        messageName: GameMessage.GAME_OVER,
        isConnectedToServer: true,
        messageBody: JSON.stringify(gameRoomDetails),
        player: gameRoomDetails.player,
        commStatus: CommStatus.IN_GAME_ROOM,
      });
    }
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        returnToHome();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
    // Disabled rule as no dependency is required here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const winnerMessage = gameMessages.find(
      (msg) => msg.messageName === GameMessage.WINNER
    );
    const waitingMessage = gameMessages.find(
      (msg) => msg.messageName === GameMessage.WAITING_PLAYER
    );

    if (winnerMessage) {
      setDisplayMessage(winnerMessage.messageBody);
    } else if (waitingMessage) {
      setDisplayMessage(waitingMessage.messageBody);
    }
  }, [gameMessages]);

  const returnToHome = () => {
    window.location.reload();
    // navigate('/home');
  };

  return (
    <div className="game-area__popup">
      <h4 className="title">Summary:</h4>
      <ul className="list">
        <li className="list__item">Rows Cleared: {rows.toString()}</li>
        <li className="list__item">Penalties: {penalties}</li>
        <li className="list__item">Score: {score}</li>
      </ul>
      <p className="score">The winner is: {displayMessage}</p>
      <p className="exit">Press ESC to go home</p>
    </div>
  );
}

export default GameAreaPopup;
