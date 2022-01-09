import TokenInterface from '../db-interface/token.interface';
import TokenModel from '../models/token.model';

import { logger } from '../middlewares/logger';

const createTokenById = async (id: string) => {
  const createdToken = await new Promise((resolve, reject) => {
    new TokenModel({
      _id: id,
      desc: id,
    }).save((err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  

  return createdToken;
};

const getTokenById = async (id: string) => {
  const refreshToken = await new Promise<TokenInterface>((resolve, reject) => {
    TokenModel.findById(id).exec((err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  logger.verbose('MongoDB Query - Retrieve Refresh Token', refreshToken);

  return refreshToken;
};

const deleteTokenById = async (id: string) => {
  const refreshToken = await new Promise<TokenInterface>((resolve, reject) => {
    TokenModel.findOneAndDelete({ _id: id }).exec((err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  logger.verbose('MongoDB Query - Delete Refresh Token', refreshToken);

  return refreshToken;
};

export { createTokenById, getTokenById, deleteTokenById };
