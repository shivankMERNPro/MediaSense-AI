import jwt from 'jsonwebtoken';
import { env } from '../constants/env';

export const generateTokens = (userId: string) => {
  const payload = { id: userId };

  const accessToken = jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.jwtRefreshSecret) as { id: string };
};
