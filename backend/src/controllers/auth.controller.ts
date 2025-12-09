import { Request, Response } from 'express';
import {
  registerUserService,
  loginUserService,
  refreshTokenService,
  googleOAuthService,
  githubOAuthService,
} from '../services/auth.service';
import { sendResponse } from '../utils/sendResponse';

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const result = await registerUserService(req.body);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService(email, password);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshTokenService(refreshToken);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const googleOAuthController = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    const result = await googleOAuthService(credential);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const githubOAuthController = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const result = await githubOAuthService(code);
    return sendResponse(res, result.code, result);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};
