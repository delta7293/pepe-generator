import axios from 'axios';
import { shuffleArray } from '../utils/shuffleArray';
import { db, kv } from 'db';

export default async function setToken() {
  const max = 2109;

  for (let tokenId = 1; tokenId <= max; tokenId++) {
    await axios({
      url: 'http://localhost:3000/api/getToken',
      method: 'POST',
      data: {
        tokenId,
      },
    });
  }
}

setToken();
