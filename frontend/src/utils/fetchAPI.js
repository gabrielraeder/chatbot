const HOST = 'https://chatbot-production-23b1.up.railway.app';
// const PORT = 3001;

export default async function fetchAPI(path, options) {
  let data;
  try {
    const response = await fetch(`${HOST}${path}`, options);
    data = await response.json();
  } catch (error) {
    console.log(error);
  }
  return data;
}
