import { AuthenticationError } from 'apollo-server-core';

export const CustomGraphQLErrors = {
    AUTH_ERROR: new AuthenticationError("User must be authenticated.")
}

export const JWTTokenFields = {
    ACCESS: "access",
    REFRESH: "refresh"
}