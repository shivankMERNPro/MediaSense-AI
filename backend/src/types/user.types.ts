export interface IUser {
  name: string;
  email: string;
  password?: string;
  role?: 'user' | 'admin';
  phone?: string;
  provider?: 'local' | 'google' | 'github';
  oauthId?: string;
  avatarUrl?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRefreshPayload {
  refreshToken: string;
}