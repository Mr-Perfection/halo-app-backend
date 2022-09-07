import { arg, enumType, extendType, intArg, nonNull, objectType, stringArg } from "nexus";

import { DBEnumType } from './DBCredentials';
import { CustomGraphQLErrors } from '../../constants/auth';
import { hasValidAuthContext } from '../../utils/auth';
import { Client } from 'pg';

  export const TestDBConnectionMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.boolean('testDBConnection', {
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

          const connectionString = `${type.toLowerCase()}://${username}:${password}@${host}:5432/postgres?schema=public`
          const client = new Client({connectionString });
          await client.connect();
          const res = await client.query('SELECT NOW()')
          await client.end()
          console.log('res', res);
          return true;
        },
      });
    }});