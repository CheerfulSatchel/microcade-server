# build stage
FROM node:14.5.0-alpine3.12
WORKDIR /app

COPY . .

RUN yarn install

# TypeScript
RUN yarn run tsc

EXPOSE 3001

CMD ["yarn", "start"]
