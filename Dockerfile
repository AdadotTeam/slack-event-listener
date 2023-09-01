FROM node:18.13.0 AS build

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build
RUN npm prune --prod

FROM node:18.13.0-alpine

RUN addgroup -g 1001 appuser && adduser -u 1001 -G appuser -s /bin/sh -D appuser

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./build/node_modules

EXPOSE $PORT

USER appuser

ARG LOG_LEVEL=silly
ARG PROJECT_NAME=adadot-slack
ARG PORT=3100
ARG ENVIRONMENT_NAME=prod
ARG SLACK_SIGNING_SECRET
ARG SLACK_APP_TOKEN
ARG SLACK_BOT_TOKEN
ARG API_KEY
ARG API_URL

ENV LOG_LEVEL=${LOG_LEVEL}
ENV PROJECT_NAME=${PROJECT_NAME}
ENV PORT=${PORT}
ENV SLACK_SIGNING_SECRET=${SLACK_SIGNING_SECRET}
ENV SLACK_APP_TOKEN=${SLACK_APP_TOKEN}
ENV SLACK_BOT_TOKEN=${SLACK_BOT_TOKEN}
ENV ENVIRONMENT_NAME=${ENVIRONMENT_NAME}
ENV API_KEY=${API_KEY}
ENV API_URL=${API_URL}

CMD ["node", "build/index.js"]
