# Use official Node.js LTS version
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose the port your app uses
EXPOSE 3000

# Start the Node.js server
CMD ["node", "src/index.js"]
