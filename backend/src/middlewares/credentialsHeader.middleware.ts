import { Request, Response } from 'express';
// --------------------------------------
// Extra Fix: Required for Cookies + RTK
// --------------------------------------
// Because some browsers require this header manually
export const credentialsHeaderMiddleware = (_req: Request, res: Response , next: any) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
};
