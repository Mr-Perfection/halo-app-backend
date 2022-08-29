import { AuthenticationError } from 'apollo-server-core';
import { isEmpty } from 'lodash';
import { objectType, extendType, enumType } from "nexus";
// src
import { NexusGenObjects } from "../../nexus-typegen";  

export const UserRole = enumType({
    name: 'UserRole',
    members: ['ADMIN', 'OPERATOR'],
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
                //@ts-ignore TODO: type the request to include user.
                const currentUser = context.req.user as NexusGenObjects['User'];
                if (isEmpty(currentUser)) throw new AuthenticationError("User must be authenticated.");
                // TODO: user should only have access to their company data. 
                // if (isEmpty(currentUser.)) throw new AuthenticationError("User must be authenticated.");
                const users = await context.prisma.user.findMany()
                return users;
            },
        });
        t.nonNull.field("getUser", {
            type: "User",
            async resolve(parent, args, context, info) {
                //@ts-ignore TODO: type the request to include user.
                const currentUser = context.req.user as NexusGenObjects['User'];
                if (isEmpty(currentUser)) throw new AuthenticationError("User must be authenticated.");
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