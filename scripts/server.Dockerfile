####################################
# Fetch dependencies + buid server #
####################################
FROM mhart/alpine-node:16 as build
WORKDIR /app
ENV CI=true

RUN apk update && apk upgrade
RUN apk --no-cache add git python3 openssl make gcc g++

# Copy project
COPY . .

# Remove large unused packages
RUN rm -rf packages/admin
RUN rm -rf packages/client

# Copy CI env file
RUN cp packages/server/.env.ci packages/server/.env

# Install all dependencies
RUN yarn install --no-immutable
RUN yarn generate:prisma
RUN yarn lerna run build --scope=@etournity/server --include-dependencies

# # Remove dev-dependencies
# #RUN yarn install --production --ignore-scripts --prefer-offline

# #####################
# # Build final image #
# #####################
FROM alpine:3.15
WORKDIR /app
ENV NODE_ENV=production

# Copy over the node pieces we need from the above image
COPY --from=build /usr/bin/node /usr/bin/
COPY --from=build /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/

COPY --from=build /app .
WORKDIR /app

# Run step
EXPOSE 5000
CMD ["node", "packages/server/dist/index.js"]
