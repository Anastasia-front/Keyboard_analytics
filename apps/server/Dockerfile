# Use Node 20 (LTS)
FROM node:lts-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy all source files
COPY . .

# Install nest-cli globally
RUN yarn global add @nestjs/cli

# Expose NestJS port
EXPOSE 4000

# Start server in development mode
CMD ["yarn", "start:dev"]
