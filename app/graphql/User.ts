import { objectType, extendType, nonNull, stringArg } from "nexus";
// src
import { NexusGenObjects } from "../../nexus-typegen";  

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("firstName");
        t.nonNull.string("lastName");
        t.nonNull.string("email");
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