const HOST = 'localhost';
const PORT = 3001;

export default async function fetchAPI(path, options) {
  let data;
  try {
    const response = await fetch(`http://${HOST}:${PORT}${path}`, options);
    data = await response.json();
  } catch (error) {
    console.log(error);
  }
  return data;
}
