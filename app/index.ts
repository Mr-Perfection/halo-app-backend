import express from 'express';
import http from 'http';
import dotenv from 'dotenv' 
import { ApolloServer } from "apollo-server-express";
import {
    ApolloServerPluginDrainHttpServer,
  } from 'apollo-server-core';
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

// TODO: Enable introspection and playfround only for development.
const isDev = process.env.mode !== 'production'

async function startApolloServer() {
    // Required logic for integrating with Express
    const app = express();
    app.use(validateTokensMiddleware)

    // Our httpServer handles incoming requests to our Express app.
    // Below, we tell Apollo Server to "drain" this httpServer,
    // enabling our servers to shut down gracefully.
    const httpServer = http.createServer(app);
  
    // Same ApolloServer initialization as before, plus the drain plugin
    // for our httpServer.
    const server = new ApolloServer({
      schema,
      context,
      csrfPrevention: true,
      cache: 'bounded',
      introspection: isDev,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageGraphQLPlayground({ settings: { 'request.credentials': 'include', } }),
      ]
    });
  
    // More required logic for integrating with Express
    await server.start();
    server.applyMiddleware({
      app,
    });
  
    // Modified server startup
    await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  }

startApolloServer();
// export const server = new ApolloServer({
//     schema,
//     context,
//     plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
// });
// server.applyMiddleware({ app })
// server.start().then(() => {
//     app.listen({port}, () => {
//         console.log(`🚀  Server ready at http://localhost:${port}${server.graphqlPath}`);
//     });
// })