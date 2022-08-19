import { objectType, extendType, nonNull, stringArg } from "nexus";
import { Client } from "pg";

export const Ticket = objectType({
  name: "Ticket",
  definition(t) {
    t.nonNull.string("context");
  },
});

// Get the contextual information about the ticket.
export const TicketQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getTicketContext", {
      type: "Ticket",
      args: {
        queries: nonNull(stringArg()),
      },
      async resolve(parent, args, context, info) {
        // postgresql://customer_db_user:customer_db_password@localhost:5433/postgres
        // const credentials = {
        //   user: "customer_db_user",
        //   host: "localhost",
        //   database: "postgres",
        //   password: "customer_db_password",
        //   port: 5433,
        // };
        const connectionString = "postgresql://customer_db_user:customer_db_password@customer_db:5432/postgres?schema=public"
        const {queries} = args;
        const client = new Client({connectionString });
        await client.connect();
        const res = await client.query(queries)
        return { context: JSON.stringify(res.rows)};
      },
    });
  },
});
