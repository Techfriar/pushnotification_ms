# Base image
FROM node:lts-alpine

# Env
ENV PORT=3001
ENV HOST=0.0.0.0

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN yarn install 

# Copy the backend code into the container
COPY . .

# Expose port for the Node.js application
EXPOSE 3001

# Set default command to start the Node.js application
CMD ["node", "server.js"]