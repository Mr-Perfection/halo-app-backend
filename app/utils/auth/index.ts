import { User } from '@prisma/client';
import * as jwt from "jsonwebtoken";
import { isEmpty } from 'lodash';
import { NexusGenObjects } from '../../../nexus-typegen';
import { JWTTokenFields } from '../../constants/auth';
import { Context } from '../../context';

// TODO: these should be coming from Secret Manager.
export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "fe83zp@AB-YYzP";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "1!@3Lizzard";

// TODO: retrieve type from nexus. This should match what we fined in graphql/Auth

export function decodeAuthHeader(authHeader: String): User {
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token found");
  }
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as User;
}

// !IMPORTANT If this is modified, modify in client side too.
export function isValidPassword(s: string): boolean {
  // Min 8 letter password, with at least a symbol, upper and lower case letters and a number.
  const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(s);
}

export function setTokens(user: User) {
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: "12h",
  });

  return { accessToken, refreshToken };
}

export function validateAccessToken(token: string): User | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as User;
  } catch {
    return null;
  }
}

export function validateRefreshToken(token: string): User | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as User;
  } catch {
    return null;
  }
}

export function tokenCookies({ accessToken, refreshToken }: {accessToken: string, refreshToken: string}) {
  const cookieOptions = {
    httpOnly: true
    // secure: true, //for HTTPS only
    // domain: "your-website.com",
    // SameSite: None
  };
  return {
    access: [JWTTokenFields.ACCESS, accessToken, cookieOptions],
    refresh: [JWTTokenFields.REFRESH, refreshToken, cookieOptions]
  } 
};

export function hasValidAuthContext(context: Context) {
  //@ts-ignore TODO: type the request to include user.
  const currentUser = context.req.user as User;
  return !isEmpty(currentUser)
}
