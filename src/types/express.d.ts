import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
    };
    cookies: {
      access_token?: string;
    };
  }
}
