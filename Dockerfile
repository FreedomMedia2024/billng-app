# Use the node version you need
FROM node:18-alpine

# Expose port 3000 for the application
EXPOSE 3000

# Set working directory to /app
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Install OpenSSL (latest available version)
RUN apk add --no-cache openssl

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json* ./

# Install dependencies in production mode and clean cache
RUN npm ci --omit=dev && npm cache clean --force

# Remove unnecessary dependencies
RUN npm remove @shopify/cli

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Check node version and openssl version
RUN node --version
RUN openssl version

# Start the application with the appropriate npm command
CMD ["npm", "run", "docker-start"]
