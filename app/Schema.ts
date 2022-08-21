import { makeSchema } from 'nexus'
import NexusPrismaScalars from 'nexus-prisma/scalars'
import { join } from 'path'
// src
import * as types from "./graphql";

export const schema = makeSchema({
  types: [NexusPrismaScalars, types],
  outputs: {
    schema: join(process.cwd(), "schema.graphql"), 
    typegen: join(process.cwd(), "nexus-typegen.ts"),
  },
  contextType: {  
    module: join(process.cwd(), "./app/context.ts"),
    export: "Context",
  },
  // plugins: [nexusPrisma({
  //   experimentalCRUD: true,
  // })],
})