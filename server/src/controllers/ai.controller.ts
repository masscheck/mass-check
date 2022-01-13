import axios from 'axios';

// Enable dotenv
import dotenv from 'dotenv';
dotenv.config();

import { logger } from '../middlewares/logger';

const API_URL = process.env.AI_SERVER_ENDPOINT;

const getAIScore = async (tweetContent: string) => {
  const aiScore = await new Promise<string>(async (resolve, reject) => {
    try {
      const res = await axios.get(`${API_URL}/predict/?`, {
        params: { tweet: tweetContent },
      });

      resolve(res.data.SCORE);
    } catch (err) {
      logger.error('Failed to get AI score', err);

      reject(err);
    }
  });

  return Number(aiScore);
};

export { getAIScore };
