import React, { useEffect, useState } from 'react';
import './App.css';
import {
  startCheck, usernameCheck, passwordCheck, loanChoices,
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
  const [options, setOptions] = useState('Here are your options:');
  const [loanOptions, setLoanOptions] = useState(false);

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
    setLoanOptions(false);
    const value = event.target.value || inputValue;
    const content = event.target.textContent;

    if (value.trim() === '' && !value) {
      setInputValue('');
      return;
    }

    if (loanChat && [1, 2, 3].includes(+value)) addMessage(content, 'user');
    else addMessage(value, 'user');

    event.preventDefault();
    setInputValue('');

    if (!started) {
      const check = startCheck(value, setStarted);
      botResponds(check);
      return;
    }
    if (!username) {
      const userCheck = usernameCheck(value, setUsername);
      botResponds(userCheck);
      return;
    }
    if (!password) {
      const passCheck = passwordCheck(value, setPassword);
      botResponds(passCheck);
      return;
    }

    if (value.toLowerCase().includes('loan')) {
      setLoanOptions(true);
      setLoanChat(true);
      return;
    }

    if (value.toLowerCase().includes('yes') && loanChat) {
      botResponds('Great! One of our support assistants will shortly contact you.');
      setOptions('May I assist you in something else?');
      setLoanOptions(true);
      return;
    }

    if (loanChat && [1, 2, 3].includes(+value)) {
      loanChoices(value, botResponds);
      return;
    }

    const regex = /[a-z0-9]+@[a-z]+\.[a-z]/;
    if (regex.test(value)) {
      botResponds('Great! We will send you an email with more informations shortly.');
      setOptions('May I assist you in something else?');
      setLoanChat(true);
      return;
    }

    if (!regex.test(value)) {
      botResponds('Invalid email, please try again...');
      return;
    }

    setLoanChat(false);

    botResponds('ChatGPT integration here');
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    if (messages[messages.length - 1]?.content.toLowerCase().includes('goodbye')) {
      setLoanOptions(false);
      setTimeout(() => {
        addMessage('Ok! Goodbye to you too!', 'bot');
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
          {
            loanOptions && (
              <div
                className="message-container bot"
              >
                <div className="message bot-message loanBtns">
                  <h5>{options}</h5>
                  <button type="button" value="1" onClick={handleFormSubmit}>Do you want to apply for a loan?</button>
                  <button type="button" value="2" onClick={handleFormSubmit}>Loan conditions</button>
                  <button type="button" value="3" onClick={handleFormSubmit}>Help</button>
                  <button type="button" onClick={() => addMessage('goodbye', 'user')}>End conversation</button>
                </div>
              </div>
            )
          }
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
