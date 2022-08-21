import { objectType, extendType, nonNull, stringArg, enumType } from "nexus";
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
    },
});

export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("getUsers", {
            type: "User",
            async resolve(parent, args, context, info) {
                const users = await context.prisma.user.findMany()
                return users;
            },
        });
    },
});