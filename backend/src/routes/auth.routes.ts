import express from 'express';

import {
  githubOAuthSchema,
  googleOAuthSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
} from '../validationSchemas/auth.schema';
import {
  registerUserController,
  loginUserController,
  refreshTokenController,
  googleOAuthController,
  githubOAuthController,
} from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest.middleware';

const router = express.Router();

router.post(
  '/auth/register',
  validateRequest(registerSchema),
  registerUserController,
);

router.post('/auth/login', validateRequest(loginSchema), loginUserController);

router.post(
  '/auth/refresh',
  validateRequest(refreshSchema),
  refreshTokenController,
);

router.post(
  '/auth/oauth/google',
  validateRequest(googleOAuthSchema),
  googleOAuthController,
);

router.post(
  '/auth/oauth/github',
  validateRequest(githubOAuthSchema),
  githubOAuthController,
);

export default router;
