# Base image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install 

# Copy the backend code into the container
COPY . .

# Expose port for the Node.js application
EXPOSE 5000

# Set default command to start the Node.js application
CMD ["node", "server.js"]
