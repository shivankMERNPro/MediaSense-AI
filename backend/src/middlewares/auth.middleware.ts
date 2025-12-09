import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../constants/env';
import { HTTP_STATUS } from '../constants/httpStatus';
import { sendResponse } from '../utils/sendResponse';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Response | void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      sendResponse(res, HTTP_STATUS.UNAUTHORIZED, {
        code: HTTP_STATUS.UNAUTHORIZED,
        message: 'Authentication token required',
      });
      return;
    }

    return jwt.verify(token, env.jwtAccessSecret, (err: any, decoded: any) => {
      if (err) {
        sendResponse(res, HTTP_STATUS.UNAUTHORIZED, {
          code: HTTP_STATUS.UNAUTHORIZED,
          message: 'Invalid or expired token',
        });
        return;
      }

      if (!decoded) {
        sendResponse(res, HTTP_STATUS.UNAUTHORIZED, {
          code: HTTP_STATUS.UNAUTHORIZED,
          message: 'Authentication failed',
        });
        return;
      }

      req.userId = decoded.userId || decoded.id;
      req.userRole = decoded.role;
      return next();
    });
  } catch (error: any) {
    return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, {
      code: HTTP_STATUS.UNAUTHORIZED,
      message: error.message || 'Authentication failed',
    });
  }
};

