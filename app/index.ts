import express from 'express';
import dotenv from 'dotenv' 
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core/dist/plugin/landingPage/graphqlPlayground';
// src
import { context } from "./context";
import { schema } from "./schema";
import validateTokensMiddleware from './middlewares/validateTokensMiddleware';

dotenv.config()

// TODO: move to env file and container env variables.
const port = 4000;

// Maybe explore Apollo gateway for micro-services.
/*
const gateway = new ApolloGateway({
    serviceList: [{ name: "accounts", url: "http://localhost:4001" }]
  });
*/
const app = express();
app.use(validateTokensMiddleware)

export const server = new ApolloServer({
    schema,
    context,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.start().then(() => {
    server.applyMiddleware({ app })
    app.listen({port}, () => {
        console.log(`🚀  Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
})