import fetchAPI from './fetchAPI';

export default async function getAPI(path) {
  return fetchAPI(path);
}
