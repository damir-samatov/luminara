FROM node:20.15.1-alpine3.19

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn db-generate

ENV PORT=3000

EXPOSE $PORT

CMD ["yarn", "docker-dev"]
