import { NextFunction, Request, Response } from "express";
import { prisma } from "../context";
import {
  validateAccessToken,
  validateRefreshToken,
  setTokens,
} from "../utils/auth";
//   const userRepo = require("../users/users-repository");

async function validateTokensMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.headers["x-refresh-token"];
  const accessToken = req.headers["x-access-token"];
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
    if (!user || user.email !== decodedRefreshToken.email) return next();
    // @ts-ignore: TODO: type req.user
    req.user = decodedRefreshToken;
    // refresh the tokens
    const userTokens = setTokens(user);
    res.set({
      "Access-Control-Expose-Headers": "x-access-token,x-refresh-token",
      "x-access-token": userTokens.accessToken,
      "x-refresh-token": userTokens.refreshToken,
    });
    return next();
  }
  next();
}

export default validateTokensMiddleware;
