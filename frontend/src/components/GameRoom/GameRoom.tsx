import React, { useState } from 'react';
import './GameRoom.scss';
import useWebSocket from '@hooks/useWebSocket';

function GameRoom() {
  const { messages, sendMessage } = useWebSocket();
  const [inputMessage, setInputMessage] = useState('');

  const handleMessageSend = () => {
    if (inputMessage.trim() !== '') {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleMessageSend();
    }
  };

  return (
    <div className="game-room">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
}

export default GameRoom;
