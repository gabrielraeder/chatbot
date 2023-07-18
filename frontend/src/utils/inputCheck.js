const startCheck = (value, isStarted) => {
  const start = ['hello', 'goodbye', 'good', 'i want'];
  // const botReply = '';
  if (start.find((str) => value.toLowerCase().includes(str.toLowerCase()))) {
    isStarted(true);
    return 'Hi there! Please enter your username...';
  }
  return "I'm sorry, I didn't understand. Can you please rephrase?";
};
const usernameCheck = (value, setUsername) => {
  if (value.includes(' ')) {
    return "username can't include spaces, please try again...";
  }
  if (value.length < 5) {
    return 'username must be longer than 5 characters, please try again...';
  }

  setUsername(value);
  return 'Please enter your password...';
};

const passwordCheck = (value, setPassword) => {
  if (value.includes(' ')) {
    return "password can't include spaces, please try again...";
  }
  if (value.length < 6) {
    return 'password must be at least 6 characters, please try again...';
  }

  setPassword(value);
  return 'Thank you! How can I assist you today?';
};

const loanResponse = (botResponds) => {
  botResponds('1 - Do you want to apply for a loan?');
  botResponds('2 - Loan conditions');
  botResponds('3 - Help');
};

const loanChoices = (value, botResponds) => {
  if (value === '1') {
    botResponds("Great! To proceed with the loan application, I'll need some information from you. Please provide your email address.");
    return;
  }

  if (value === '2') {
    botResponds('Our loan conditions include competitive interest rates, flexible repayment terms, and fast approval process. Could you please provide more specific details about the loan you are interested in?');
    return;
  }
  botResponds('Of course! I\'m here to help. Would you like to talk to one of our support assistants?');
};

export {
  startCheck, usernameCheck, passwordCheck, loanResponse, loanChoices,
};
