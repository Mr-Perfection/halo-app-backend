import * as jwt from "jsonwebtoken";

export const APP_SECRET = process.env.APP_SECRET || ''

export interface AuthTokenPayload { 
    userId: number;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
        throw new Error("No token found");
    }
    return jwt.verify(token, APP_SECRET) as AuthTokenPayload;
}

export function checkPassword(s: string): boolean {
    // Min 8 letter password, with at least a symbol, upper and lower case letters and a number.
    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(s);
}
