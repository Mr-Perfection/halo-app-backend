import { User } from '@prisma/client';
import { arg, enumType, extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { CustomGraphQLErrors } from '../../constants/auth';
import { hasValidAuthContext } from '../../utils/auth';

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
    t.field("customer", {
      type: "Customer",
    })
    t.nonNull.string("host");
    t.nonNull.string("port");
    t.nonNull.string("name");
    t.nonNull.string("username");
    t.nonNull.string("password");
    t.dateTime("createdAt");
    t.dateTime("updatedAt");
  },
});

export const DBCredentialsrMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createDBCredentials", {
      type: "DBCredentials",
      args: {
        type: nonNull(arg({type: DBEnumType})),
        host: nonNull(stringArg()),
        port: nonNull(stringArg()),
        name: nonNull(stringArg()),
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        if (!hasValidAuthContext(context)) throw CustomGraphQLErrors.AUTH_ERROR;
        const { type, host, port, name, username, password } = args;
        // TODO: type the request to include user.
        //@ts-ignore 
        const currentUser = context.req.user as User;
        const dBCredentials = await context.prisma.dBCredentials.create({
          data: {
            type,
            customerId: currentUser.customerId,
            host,
            port,
            name,
            username,
            password
        },
        });
        return dBCredentials;
      },
    });
    t.nonNull.field("deleteDBCredentials", {
      type: "DBCredentials",
      args: {
        id: nonNull(intArg()),
      },
      async resolve(parent, args, context) {
        if (!hasValidAuthContext(context)) throw CustomGraphQLErrors.AUTH_ERROR;
        const { id } = args;
        // TODO: type the request to include user.
        //@ts-ignore 
        const currentUser = context.req.user as User;
        
        // Ensure that credentials cannot be deleted by non-current customers.
        await context.prisma.dBCredentials.findFirstOrThrow({
          where: {
            id,
            customerId: currentUser.customerId,
          }
        })
        
        return await context.prisma.dBCredentials.delete({
          where: {
            id,
          }
        });
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
