import { arg, enumType, extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { prisma, User as PrismaUser } from '@prisma/client';

import { CustomGraphQLErrors } from '../constants/auth';
import { hasValidAuthContext } from '../utils/auth';
/**
 * Operator queuing system:
 * In the user interface, admin will construct what operator view will look like.
 * 
 */
export const QueueItem = objectType({
    name: "QueueItem",
    definition(t) {
        t.nonNull.string("severity");
        t.nonNull.json("data");
    },
});

export const Queue = objectType({
    name: "Queue",
    definition(t) {
        t.nonNull.string("name");
        t.nonNull.int("widgetCount");
        t.dateTime("createdAt");
    },
});

export const QueueQuery = extendType({
    type: "Query",
    definition(t) {
      t.nonNull.list.nonNull.field("getAllQueues", {
        type: "Queue",
        async resolve(parent, args, context) {
            if (!hasValidAuthContext(context)) throw CustomGraphQLErrors.AUTH_ERROR;
            //@ts-ignore TODO: type the request to include user.
            const currentUser = context.req.user as PrismaUser;
            
            const queues = await context.prisma.queue.findMany({
                where: {
                    customerId: currentUser.customerId,
                },
                include: { widgets: true },
              })

            const result = queues.map((queue) => {
            return { ...queue, widgetCount: queue.widgets.length }
            })

            // TODO: add pagination
            return result;
        }
      });
    }
  })

export const QueueMutation = extendType({
    type: "Mutation",
    definition(t) {
      t.nonNull.field("sendQueueItem", {
        type: "QueueItem",
        args: {
          severity: nonNull(stringArg()),
          data: nonNull(stringArg()),
        },
        async resolve(parent, args, context) {
            const { severity, data} = args;

            return { severity, data: JSON.parse(data)}
        },
    });
}
})


  