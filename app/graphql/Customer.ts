import { extendType, nonNull, objectType, stringArg } from "nexus";

export const Customer = objectType({
  name: "Customer",
  definition(t) {
    t.nonNull.int("id");
    t.string("slug");
    t.dateTime("createdAt");
    t.list.field('users', {
      type: "User",
      resolve(root, args, ctx) {
        return ctx.prisma.user.findMany({ where: {
          customerId: root.id
        }})
      },
    })
    // t.list.field('databases', {
    //   type: "DBCredentials",
    //   resolve(root, args, ctx) {
    //     return ctx.prisma.dBCredentials.findMany({ where: {
    //       customerId: root.id
    //     }})
    //   },
    // })
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
        const { slug } = args;
        const customer = await context.prisma.customer.create({
          data: { slug },
        });
        return customer;
      },
    });
  },
});

export const CustomerQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getCustomer", {
      type: "Customer",
      args: {
        slug: stringArg(),
      },
      async resolve(parent, args, context, info) {
        const { slug } = args;
        const customer = await context.prisma.customer.findUniqueOrThrow({
            where: {
                slug: slug ?? undefined,
            }
        })
        return customer;
      },
    });
  },
});
