# Build stage: ts -> js
FROM node:18-slim as builder

WORKDIR /usr/src

RUN apt-get update
RUN apt-get install -y openssl
COPY package*.json ./
COPY . .
RUN yarn
RUN yarn run prisma
RUN yarn run build

EXPOSE 4000

CMD ["yarn", "run", "start:migrate:prod"]

# TODO: Optimize docker build to use less disk space / memory.
# Ideally, we should use alpine but I was not able to get it working
# locally with my ARM-based Macbook M1.
# Convert this to Dockerfile.dev and create Dockerfile with Alpine.
# Also, should not include dev dependencies.

# Run stage: run node on port 4000.
# FROM node:18-slim

# WORKDIR /usr/src

# ARG NODE_ENV=production
# ENV NODE_ENV $NODE_ENV

# RUN apt-get update
# RUN apt-get install -y openssl
# COPY --from=builder /usr/src/package*.json ./
# COPY --from=builder /usr/src/node_modules ./
# COPY --from=builder /usr/src/dist ./dist
# COPY --from=builder /usr/src/prisma ./prisma
# RUN yarn run prisma

# EXPOSE 4000

# CMD ["yarn", "run", "start:migrate:prod"]
