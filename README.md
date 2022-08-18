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
yarn run migrate:stage # Migrate without creating migrations
yarn run migrate # To run the migrations
```

# How to run fake customer DB locally
Follow the README in test-customer-db/README.md.

# Running www-backend service with Docker. 
```sh
docker build -t www-backend .
# For M1 Macbook (ARM-based)

docker run -p 4000:4000 --env-file .env -d

```

# AWS
aws-cli/2.2.43 Python/3.8.8 Darwin/21.6.0 exe/x86_64 prompt/off
copilot version: v1.21.0