import React, { useEffect, useState } from 'react';
import './App.css';
import {
  startCheck, usernameCheck, passwordCheck, loanResponse, loanChoices,
} from './utils/inputCheck';
import csvDownload, { addData } from './utils/csvDownload';
import Header from './components/Header';

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

  const addMessage = (content, role) => {
    setMessages((prevMessages) => [...prevMessages, { role, content }]);
  };

  const botResponds = (botReply) => setTimeout(() => {
    addMessage(botReply, 'bot');
  }, 500);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setInputValue('');
      return;
    }

    addMessage(inputValue, 'user');
    setInputValue('');

    if (inputValue.toLowerCase().includes('goodbye')) {
      botResponds('Goodbye to you too!');
      return;
    }

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

    // if (inputValue.toLowerCase().includes('goodbye')) {
    //   botResponds('Goodbye to you too!');
    //   return;
    // }

    botResponds('ChatGPT integration here');
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    if (messages[messages.length - 1]?.content.toLowerCase().includes('goodbye to you too!')) {
      setTimeout(() => {
        addData(messages);
        setMessages([]);
        setStarted(false);
      }, 1000);
    }
  }, [messages]);

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-messages" id="chat-messages">
          <Header />
          {messages.map((message, index) => (
            <div
              key={`${index + message}`}
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
          <button type="submit" disabled={!inputValue}>Send</button>
          <button type="button" onClick={() => csvDownload(messages)}>🡻</button>
        </form>
      </div>
    </div>
  );
}

export default App;
