FROM node:18-alpine as builder


WORKDIR /app

COPY . .

RUN npm ci && npm run build

FROM node:18-alpine

WORKDIR /app

RUN apk add git

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/favicon.png /app/favicon.png
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/work /app/work

RUN npm prune --omit=dev

ENTRYPOINT [ "node", "/app/dist/main.js" ]
