declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: string;
      username: string;
    };
    data?: {};
  }
}
