FROM node:18-alpine

RUN apk add --no-cache build-base curl

# Download and compile OpenSSL 1.1.x
RUN curl -O https://www.openssl.org/source/openssl-1.1.1u.tar.gz && \
    tar -xzf openssl-1.1.1u.tar.gz && \
    cd openssl-1.1.1u && \
    ./config && make && make install && \
    cd .. && rm -rf openssl-1.1.1u*

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force
RUN npm remove @shopify/cli

COPY . .

RUN npm run build

CMD ["npm", "run", "docker-start"]
