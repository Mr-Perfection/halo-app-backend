import { extendType, nonNull, objectType, stringArg } from "nexus";
// src
import { NexusGenObjects } from "../../nexus-typegen";  

export const Customer = objectType({
    name: "Customer",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("slug");
        t.nonNull.string("createdAt");
    },
});

export const CustomerMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createCustomer", { 
            type: "Customer",
            args: {
                slug: nonNull(stringArg()),
            },
            async resolve(parent, args, context) {
                const  { slug } = args;
                const customer = await context.prisma.customer.create({
                    data: { slug },
                });
                return customer;
            }})
    }
})