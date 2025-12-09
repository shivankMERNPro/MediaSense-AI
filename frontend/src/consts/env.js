const env = {
  viteEncryptionKey: import.meta.env.VITE_ENCRYPTION_KEY ?? "",
  mode: import.meta.env.MODE ?? "",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
  githubClientId: import.meta.env.VITE_GITHUB_CLIENT_ID ?? "",
  oauthRedirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI ?? "",
};

export default env;
