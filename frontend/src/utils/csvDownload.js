import { saveAs } from 'file-saver';

const data = [];

export const addData = (newData) => {
  const alreadySaved = data.length && data[data.length - 1].messages === newData;
  if (!alreadySaved && newData.length) {
    data.push({ messages: newData, date: new Date().toISOString() });
  }
};

export default async (newData) => {
  let csvContent = 'user,messages\n';
  addData(newData);
  data.forEach((item, idx) => {
    const user = `Conversation #${idx + 1} - ${item.date}`;
    const msg = JSON.stringify(item.messages);
    csvContent += `${user},${msg}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'chat.csv');
};
