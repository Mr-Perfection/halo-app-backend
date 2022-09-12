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
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.int("widgetCount");
        t.dateTime("createdAt");
        t.dateTime("updatedAt");
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
                include: {
                    _count: {
                      select: {
                        widgets: true
                      }
                    }
                  }
              })

            // TODO: add pagination
            return queues.map((queue) => {
              return { ...queue, widgetCount: queue._count.widgets }
            });
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

      t.nonNull.field("createQueue", {
        type: "Queue",
        args: {
          name: nonNull(stringArg()),
        },
        async resolve(parent, args, context) {
          if (!hasValidAuthContext(context)) throw CustomGraphQLErrors.AUTH_ERROR;
          //@ts-ignore TODO: type the request to include user.
          const currentUser = context.req.user as PrismaUser;

          const { name } = args;
          const queue = await context.prisma.queue.create({
            data: {
              customerId: currentUser.id,
              name,
            }
          })
          return queue;
        },
      });

      t.nonNull.field("updateQueue", {
        type: "Queue",
        args: {
          id: nonNull(intArg()),
          name: stringArg(),
        },
        async resolve(parent, args, context) {
          if (!hasValidAuthContext(context)) throw CustomGraphQLErrors.AUTH_ERROR;
          //@ts-ignore TODO: type the request to include user.
          const currentUser = context.req.user as PrismaUser;

          const { id, name } = args;

          const queue = await context.prisma.queue.update({
            where: { id },
            data: {
              customerId: currentUser.id,
              name: name ?? undefined,
            }
          })
          return queue;
        },
      });

      t.nonNull.field("deleteQueue", {
        type: "Queue",
        args: {
          id: nonNull(intArg()),
        },
        async resolve(parent, args, context) {
          if (!hasValidAuthContext(context)) throw CustomGraphQLErrors.AUTH_ERROR;

          const { id } = args;
          const queue = await context.prisma.queue.delete({
            where: { id },
          })
          return queue;
        },
      });
    }
})


  