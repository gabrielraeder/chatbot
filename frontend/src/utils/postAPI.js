import fetchAPI from './fetchAPI';

export default async function postAPI(path, body) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
  return fetchAPI(path, options);
}
