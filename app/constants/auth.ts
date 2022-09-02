import { AuthenticationError, ValidationError } from 'apollo-server-core';

export const CustomGraphQLErrors = {
    AUTH_ERROR: new AuthenticationError("User must be authenticated."),
    INVALID_CUSTOMER_ERROR: new ValidationError("Customer does not exist or is invalid.")
}

export const JWTTokenFields = {
    ACCESS: "access",
    REFRESH: "refresh"
}