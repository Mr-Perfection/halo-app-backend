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

# Running locally (not Docker).
Use this during development. This command auto-generate the schema and such.
If you are running docker, it conflicts with `port 4000`. You can temporarily change it to
`4001` in `app/index.ts` to see the changes.
```bash
yarn run dev # This also auto-generate the GraphQL schema.
```

**Use the Apollo's sandbox url: https://studio.apollographql.com/sandbox/explorer for auto-complete and other rich features.**


# Visualize the DB with TablePlus
- Install TablePlus (Mac)
- Paste this url `postgresql://customer_db_user:customer_db_password@localhost:5432/postgres?schema=public` into 
the browser. This is our test db for our customer. Use TablePlus to dump the data here if needed.
- Our test app db url is `postgresql://db_user:db_password@localhost:5432/postgres?schema=public`. You can see the changes
that we make in there.

# DB Migrations
```bash
yarn run migrate:stage # Migrate without creating migrations
yarn run migrate # To run the migrations
```

# Running www-backend service with Docker locally.
- Install docker desktop. Use it to check the container status. You can run `docker ps` as well as other docker commands.
```sh
# Dockerfile is used for deployment. Use Dockerfile.dev instead.
# Comment out www-backend-api container part in dockerfile.dev if you want to run backend apis locally with the yarn script.
docker build -f Dockerfile.dev -t www-backend . --no-cache
# Recommended: Run docker-compose.
docker-compose up -d
# If you need to rebuild run:
docker-compose up --build --force-recreate -d
# If you just want to run api, run this command.
docker run -p 4000:4000 --env-file .env -d
```

# AWS
aws-cli/2.2.43 Python/3.8.8 Darwin/21.6.0 exe/x86_64 prompt/off
copilot version: v1.21.0

# Deployment
```sh
# ensure that migrations are up to date. Take a look at DB Migrations section.
yarn run migrate "add your message"

# Deploy graphql service
copilot deploy --name graphql
```

# Nexus Prisma Plugin (TBD)
https://github.com/graphql-nexus/nexus-plugin-prisma/issues/1039
Currently, plugin is way behind the current version of Prisma (v4.x.x).
Benefit of using this is we don't have to manually define models from Prisma to nexus
every time we create new model or update it... Hopefully, they release latest plugin.
It will save dev time.
https://nexusjs.org/docs/plugins/prisma/overview#about


# TBD Apollo Studio
## Why?
It provides the changelogs of APIs, data privacy, etc https://www.apollographql.com/docs/federation/managed-federation/overview/. Not high priority but something to consider as the team gets bigger.

## Setup
https://www.apollographql.com/tutorials/fullstack-quickstart/connecting-graphs-to-apollo-studio


# .env template
```sh
DATABASE_URL= # After running docker containers for databases only, you can grab thr URL. i.e. postgresql://db_user:db_password@localhost:5432/postgres?schema=public

```

# Connect to test customer AWS RDS
Ensure that the RDS instance has the following set up:
* Publicly accessible
* VPC
    * Make sure that ACL does not have rules that may block the allowlist ip addreses.
* Security Group
    * Add ip addresses that need to be whitelisted in inbound rules.


```sh
# test connection (macOS)
nc -vz  test-customer-db.cf3evrfkpbgr.us-west-2.rds.amazonaws.com 5432
# output should show the success message.
```
References
https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Troubleshooting.html#CHAP_Troubleshooting.Connecting
https://aws.amazon.com/premiumsupport/knowledge-center/aurora-mysql-connect-outside-vpc/
https://www.calculator.net/ip-subnet-calculator.html
https://www.youtube.com/watch?v=PxFZt8MG2ss

