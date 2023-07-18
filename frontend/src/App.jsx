import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import './App.css';
import {
  startCheck, usernameCheck, passwordCheck, loanResponse, loanChoices,
} from './utils/inputCheck';
import postAPI from './utils/postAPI';
import getAPI from './utils/getAPI';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [started, setStarted] = useState(false);
  const [loanChat, setLoanChat] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const addUserMessage = (content) => {
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content }]);
  };

  const addBotMessage = (content) => {
    setMessages((prevMessages) => [...prevMessages, { role: 'bot', content }]);
  };

  const botResponds = (botReply) => setTimeout(() => {
    addBotMessage(botReply);
  }, 500);

  const handleCSVDownload = async () => {
    const data = await getAPI('/chat');

    let csvContent = 'user,messages\n';

    data.forEach((item) => {
      const user = `Conversation user #${item.number} - ${item.date}`;
      const msg = JSON.stringify(item.messages);

      csvContent += `${user},${msg}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'chat_csv.csv');
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim() === '') return;

    addUserMessage(inputValue);
    setInputValue('');

    if (!started) {
      const check = startCheck(inputValue, setStarted);
      botResponds(check);
      return;
    }
    if (!username) {
      const userCheck = usernameCheck(inputValue, setUsername);
      botResponds(userCheck);
      return;
    }
    if (!password) {
      const passCheck = passwordCheck(inputValue, setPassword);
      botResponds(passCheck);
      return;
    }

    if (inputValue.toLowerCase().includes('loan')) {
      loanResponse(botResponds);
      setLoanChat(true);
      return;
    }

    if (inputValue.toLowerCase().includes('yes') && ['2', '3'].includes(messages[messages.length - 2].content)) {
      botResponds('Great! One of our support assistants will shortly contact you.');
      return;
    }

    if (loanChat && [1, 2, 3].includes(+inputValue)) {
      loanChoices(inputValue, botResponds);
      return;
    }

    const regex = /[a-z0-9]+@[a-z]+\.[a-z]/;
    if (regex.test(inputValue)) {
      botResponds('Great! We will send you an email with more informations shortly.');
      botResponds('May I assist you in something else?');
      return;
    }

    if (!regex.test(inputValue)) {
      botResponds('Invalid email, please try again...');
      return;
    }

    setLoanChat(false);

    if (inputValue.toLowerCase().includes('goodbye')) {
      botResponds('Goodbye to you too!');
      return;
    }

    botResponds('ChatGPT integration here');
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    const fetch = async () => {
      await postAPI('/chat', { messages });
    };
    if (messages[messages.length - 1]?.content.toLowerCase().includes('goodbye to you too!')) {
      fetch();
      setStarted(false);
    }
  }, [messages]);

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-messages" id="chat-messages">
          {messages.map((message, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`message-container ${message.role === 'user' ? 'user' : 'bot'}`}
            >
              <div className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
          <button type="button" onClick={handleCSVDownload}>🡻</button>
        </form>
      </div>
    </div>
  );
}

export default App;
