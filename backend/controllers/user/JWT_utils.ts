// importing of bcrypt and json

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()


const hashPassword = async (password: string) => {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
  }
};
const comparePassword = async (password: string, hashedPassword: string) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (err) {
    console.error("Error comparing password:", err);
  }
};

const generateJwt = (payload: any) => {
  const SECRET = process.env.JWT_SECRET;

  const data = jwt.sign(
    { id: payload.id, role: payload.role, username: payload.username },
    SECRET as string,
    { expiresIn: "2h" }
  );
  return data;
};

const resetLinkJwt = (id: string) => {
  const SECRET = process.env.JWT_SECRET;
  const jwt_link = jwt.sign({ id: id }, SECRET as string, { expiresIn: "1h" });
  return jwt_link;
};

const jwt_validator = async (token: string) => {
  const payload = await jwt.verify(token, process.env.JWT_SECRET as string);
  return payload;
};

export const JWT_UTILS = {
  hashPassword,
  comparePassword,
  generateJwt,
  resetLinkJwt,
  jwt_validator
};
