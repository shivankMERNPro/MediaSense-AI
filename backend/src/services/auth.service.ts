import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';
import { Types } from 'mongoose';
import { User } from '../models/user.model';
import { IUser } from '../types/user.types';
import { hashPassword } from '../utils/hashPassword';
import { comparePassword } from '../utils/comparePassword';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ApiResponse } from '../types/apiResponse.type';
import { generateTokens, verifyRefreshToken } from '../utils/token';
import { env } from '../constants/env';

const googleClient = env.googleClientId
  ? new OAuth2Client(env.googleClientId)
  : null;

const sanitizeUser = (user: any) => {
  if (!user) return null;
  const userObj = user.toObject ? user.toObject() : user;
  const { password, ...rest } = userObj;
  return rest;
};

const getUserId = (user: any) => {
  if (!user?._id) return '';
  if (user._id instanceof Types.ObjectId) {
    return user._id.toString();
  }
  if (typeof user._id === 'string') {
    return user._id;
  }
  return `${user._id}`;
};

const buildAuthPayload = (user: any) => {
  const tokens = generateTokens(getUserId(user));
  return {
    user: sanitizeUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

type GithubTokenResponse = {
  access_token?: string;
  error?: string;
  [key: string]: any;
};

type GithubUserResponse = {
  id?: number;
  login?: string;
  name?: string;
  avatar_url?: string;
};

type GithubEmailResponse = {
  email?: string;
  primary?: boolean;
}[];

export const registerUserService = async (
  newUser: IUser & { confirmPassword: string },
): Promise<ApiResponse<any>> => {
  const { name, email, password, phone, role } = newUser;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      code: HTTP_STATUS.CONFLICT,
      message: 'User already exists',
      error: `User with email ${email} already exists`,
    };
  }

  const hashedPassword = await hashPassword(password!);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: role || 'user',
    provider: 'local',
  });

  return {
    code: HTTP_STATUS.CREATED,
    message: 'User registered successfully',
    data: buildAuthPayload(user),
  };
};

export const loginUserService = async (
  email: string,
  password: string,
): Promise<ApiResponse<any>> => {
  const user = await User.findOne({ email });

  if (!user || user.provider !== 'local') {
    return {
      code: HTTP_STATUS.UNAUTHORIZED,
      message: 'Invalid credentials',
    };
  }

  const isMatch = await comparePassword(password, user.password!);
  if (!isMatch) {
    return {
      code: HTTP_STATUS.UNAUTHORIZED,
      message: 'Invalid credentials',
    };
  }

  return {
    code: HTTP_STATUS.OK,
    message: 'Login successful',
    data: buildAuthPayload(user),
  };
};

export const refreshTokenService = async (
  refreshToken: string,
): Promise<ApiResponse<any>> => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.id);
    if (!user) {
      return {
        code: HTTP_STATUS.UNAUTHORIZED,
        message: 'Invalid refresh token',
      };
    }

    const tokens = generateTokens(getUserId(user));
    return {
      code: HTTP_STATUS.OK,
      message: 'Token refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  } catch (error: any) {
    return {
      code: HTTP_STATUS.UNAUTHORIZED,
      message: error.message || 'Invalid refresh token',
    };
  }
};

export const googleOAuthService = async (
  credential: string,
): Promise<ApiResponse<any>> => {
  if (!googleClient) {
    return {
      code: HTTP_STATUS.INTERNAL_SERVER,
      message: 'Google OAuth not configured',
    };
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });
  const payload = ticket.getPayload();

  if (!payload?.email) {
    return {
      code: HTTP_STATUS.UNAUTHORIZED,
      message: 'Unable to verify Google account',
    };
  }

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      name: payload.name || 'Google User',
      email: payload.email,
      provider: 'google',
      oauthId: payload.sub,
      avatarUrl: payload.picture,
      role: 'user',
    });
  }

  return {
    code: HTTP_STATUS.OK,
    message: 'Google login successful',
    data: buildAuthPayload(user),
  };
};

export const githubOAuthService = async (
  code: string,
): Promise<ApiResponse<any>> => {
  if (!env.githubClientId || !env.githubClientSecret || !env.githubRedirectUri) {
    return {
      code: HTTP_STATUS.INTERNAL_SERVER,
      message: 'GitHub OAuth not configured',
    };
  }

  const tokenResponse = (await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.githubClientId,
      client_secret: env.githubClientSecret,
      code,
      redirect_uri: env.githubRedirectUri,
    }),
  }).then((res) => res.json())) as GithubTokenResponse;

  if (!tokenResponse.access_token) {
    return {
      code: HTTP_STATUS.UNAUTHORIZED,
      message: 'Failed to exchange GitHub code',
      error: tokenResponse,
    };
  }

  const userResponse = (await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
      'User-Agent': 'MediaMind-App',
    },
  }).then((res) => res.json())) as GithubUserResponse;

  const emailResponse = (await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
      'User-Agent': 'MediaMind-App',
    },
  }).then((res) => res.json())) as GithubEmailResponse;

  const primaryEmail = Array.isArray(emailResponse)
    ? emailResponse.find((email: any) => email.primary)?.email ||
      emailResponse[0]?.email
    : null;

  const email =
    primaryEmail ||
    (userResponse.login
      ? `${userResponse.login}@users.noreply.github.com`
      : undefined);

  if (!email) {
    return {
      code: HTTP_STATUS.UNAUTHORIZED,
      message: 'Unable to retrieve GitHub email',
    };
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: userResponse.name || userResponse.login || 'GitHub User',
      email,
      provider: 'github',
      oauthId: userResponse.id?.toString(),
      avatarUrl: userResponse.avatar_url,
      role: 'user',
    });
  }

  return {
    code: HTTP_STATUS.OK,
    message: 'GitHub login successful',
    data: buildAuthPayload(user),
  };
};
