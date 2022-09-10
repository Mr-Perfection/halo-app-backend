import { arg, enumType, extendType, intArg, nonNull, objectType, stringArg } from "nexus";
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


  