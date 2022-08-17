# halo-app-backend
backend apis

# References
Project setup: https://blog.logrocket.com/build-graphql-app-node-js-typescript-graphql-request/

# Prereqs
Docker
Node v18.7.0
Yarn v1.22.17

# Installatiosn
```bash
yarn install
```

# Running locally
```bash
yarn run dev # This also auto-generate the GraphQL schema.
```

# DB Migrations
```bash
yarn run stage-migrate # Migrate without creating migrations
yarn run migrate # To run the migrations
```

# How to run fake customer DB locally
Follow the README in test-customer-db/README.md.