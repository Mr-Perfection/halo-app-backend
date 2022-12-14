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
        //   const currentUser = context.req.user as User;
          const connectionString = `${type.toLowerCase()}://${username}:${password}@${host}:${port}/${name}`
          const client = new Client({ connectionString, connectionTimeoutMillis: 3000 });
          await client.connect();
          const res = await client.query('SELECT NOW()')
          await client.end()
          return true;
        },
      });
    }});