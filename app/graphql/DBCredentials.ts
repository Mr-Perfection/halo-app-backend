import { User } from '@prisma/client';
import { arg, enumType, extendType, nonNull, objectType, stringArg } from "nexus";
import { CustomGraphQLErrors } from '../constants/auth';
import { hasValidAuthContext } from '../utils/auth';

const DBEnumType = enumType({
    name: 'DBType',
    members: ['POSTGRESQL', 'MYSQL'],
    description: 'Type of database credentials that user has.',
  })


export const DBCredentials = objectType({
  name: "DBCredentials",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.field("type", {
        type: "DBType",
    })
    t.nonNull.string("connectionString");
    t.dateTime("createdAt");
    t.dateTime("updatedAt");
    t.field("customer", {
        type: "Customer",
    })
  },
});

export const DBCredentialsrMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createDBCredentials", {
      type: "DBCredentials",
      args: {
        type: nonNull(arg({type: DBEnumType})),
        connectionString: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        if (!hasValidAuthContext(context)) throw CustomGraphQLErrors.AUTH_ERROR;
        const { connectionString, type } = args;
        // TODO: type the request to include user.
        //@ts-ignore 
        const currentUser = context.req.user as User;
        const dBCredentials = await context.prisma.dBCredentials.create({
          data: {
            type,
            customerId: currentUser.customerId,
            connectionString
        },
        });
        return dBCredentials;
      },
    });
  },
});

export const DBCredentialsQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("getAllDBCredentials", {
      type: "DBCredentials",
      async resolve(parent, args, context, info) {
        if (!hasValidAuthContext(context)) throw CustomGraphQLErrors.AUTH_ERROR;
        // TODO: type the request to include user.
        //@ts-ignore 
        const currentUser = context.req.user as User;
        const customerId = currentUser.customerId;

        if (customerId === undefined) throw CustomGraphQLErrors.INVALID_CUSTOMER_ERROR;
        const allDBCredentials = await context.prisma.dBCredentials.findMany({
            where: {
              customerId,
          },
          });
        return allDBCredentials;
      },
    });
  },
});
