# Use Node LTS image
FROM node:lts-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json yarn.lock* ./

# Install dependencies with longer timeout
RUN yarn install --network-timeout 100000

# Copy the rest of the files
COPY . .

# Expose port
EXPOSE 3000

# Run Next.js dev server
CMD ["yarn", "dev"]
