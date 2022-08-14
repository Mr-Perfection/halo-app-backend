import { extendType, objectType } from "nexus";
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

let users: NexusGenObjects["User"][]= [   // 1
    {
        id: 1,
        firstName: "Steph",
        lastName: "Lee",
        email: "stephenslee0127@gmail.com"
    },
];

export const UserQuery = extendType({ 
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("users", {
            type: "User",
            resolve(parent, args, context, info) {
                return users;
            },
        });
    },
});