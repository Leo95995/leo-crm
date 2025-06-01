import jwt, { JwtPayload } from "jsonwebtoken";
// import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

import { NextFunction, Request, Response } from "express";

interface MyJwtPayload {
  id: string;
  role: string;
  username: string;
  iat?: number;
  exp?: number;
}

const check_jwt_protection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(`Bearer`)
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const payload = (await jwt.verify(
        token,
        process.env.JWT_SECRET as string
      )) as MyJwtPayload;

      req.user = payload as MyJwtPayload;
     
      next();
    } catch (error) {
      res.status(401).json("Unathorized, fake bearer");
    }
  } else {
    res.status(401).json("Unathorized, missing bearer");
  }
};

export const authMiddleware = {
  check_jwt_protection,
};
