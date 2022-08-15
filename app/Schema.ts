import { makeSchema } from 'nexus'
import { join } from 'path'
// src
import * as types from "./graphql";

export const schema = makeSchema({
  types,
  outputs: {
    schema: join(process.cwd(), "schema.graphql"), 
    typegen: join(process.cwd(), "nexus-typegen.ts"),
  },
  contextType: {  
    module: join(process.cwd(), "./app/context.ts"),
    export: "Context",
  },
})