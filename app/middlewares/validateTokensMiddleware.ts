import { NextFunction, Request, Response } from "express";
import { JWTTokenFields } from '../constants/auth';
import { prisma } from "../context";
import {
  validateAccessToken,
  validateRefreshToken,
  setTokens,
  tokenCookies,
} from "../utils/auth";
//   const userRepo = require("../users/users-repository");

async function validateTokensMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.cookies[JWTTokenFields.REFRESH];
  const accessToken = req.cookies[JWTTokenFields.ACCESS];
  if (!accessToken && !refreshToken) return next();

  const decodedAccessToken = validateAccessToken(accessToken as string);
  if (decodedAccessToken) {
    // @ts-ignore: TODO: type req.user
    req.user = decodedAccessToken;
    return next();
  }

  const decodedRefreshToken = validateRefreshToken(refreshToken as string);
  // https://www.richardkotze.com/coding/json-web-tokens-using-apollo-graphql
  if (decodedRefreshToken) {
    // valid refresh token
    const user = await prisma.user.findUnique({
      where: { id: decodedRefreshToken.id },
    });
    // valid user and user token not invalidated
    if (!user || user.email !== decodedRefreshToken.email) {
      // remove cookies if token not valid
      res.clearCookie(JWTTokenFields.ACCESS);
      res.clearCookie(JWTTokenFields.REFRESH);
      return next()
    };
    // @ts-ignore: TODO: type req.user
    req.user = decodedRefreshToken;
    // refresh the tokens
    const userTokens = setTokens(user);

    // update the cookies with new tokens
    const cookies = tokenCookies(userTokens);
    // @ts-ignore
    res.cookie(...cookies.access);
    // @ts-ignore
    res.cookie(...cookies.refresh);
    return next();
  }
  next();
}

export default validateTokensMiddleware;
