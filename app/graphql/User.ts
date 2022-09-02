import { User as PrismaUser } from '@prisma/client';
import { objectType, extendType, enumType } from "nexus";
// src
import { CustomGraphQLErrors } from '../constants/auth';
import { hasValidAuthContext } from '../utils/auth';

export const UserRole = enumType({
    name: 'UserRole',
    members: ['ADMIN', 'OPERATOR', 'ROOT'],
    description: 'Roles that determine what permissions the user has access to.',
  })

  
export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("firstName");
        t.nonNull.string("lastName");
        t.nonNull.string("email");
        t.nonNull.field("role", {
            type: "UserRole",
        })
        t.field("customer", {
            type: "Customer",
        })
    },
});

export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("getUsers", {
            type: "User",
            async resolve(parent, args, context, info) {
                if (!hasValidAuthContext(context)) throw CustomGraphQLErrors.AUTH_ERROR;
                //@ts-ignore TODO: type the request to include user.
                const currentUser = context.req.user as PrismaUser;
                switch(currentUser.role) {
                    case 'ADMIN':
                        return await context.prisma.user.findMany({ 
                            where: { 
                                customerId: currentUser.customerId,
                                role: {
                                    in: ['OPERATOR'],
                                }
                            },
                        })
                    case 'ROOT':
                        return await context.prisma.user.findMany({ 
                            where: { 
                                customerId: currentUser.customerId,
                                role: {
                                    in: ['OPERATOR', 'ADMIN'],
                                }
                            } 
                        })
                    default:
                        return []
                }
            },
        });

        t.nonNull.field("getUser", {
            type: "User",
            async resolve(parent, args, context, info) {
                if (!hasValidAuthContext(context)) throw CustomGraphQLErrors.AUTH_ERROR;
                //@ts-ignore TODO: type the request to include user.
                const currentUser = context.req.user as PrismaUser;
                // TODO: user should only have access to their company data. 
                // if (isEmpty(currentUser.)) throw new AuthenticationError("User must be authenticated.");
                const user = await context.prisma.user.findFirstOrThrow({
                    where: { id: currentUser.id },
                  });
                  const customer = await context.prisma.customer.findFirstOrThrow({
                    where: { id: user.customerId },
                  });
                return {...user, customer: customer};
            },
        });
    },
});