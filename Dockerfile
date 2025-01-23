FROM node:18-alpine3.16

EXPOSE 3000

WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL 1.1.x
RUN apk add --no-cache openssl=1.1.1n-r8

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force
RUN npm remove @shopify/cli

COPY . .

RUN npm run build

CMD ["npm", "run", "docker-start"]
