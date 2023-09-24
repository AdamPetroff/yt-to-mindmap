# /frontend/Dockerfile.dev
FROM node:16

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the server port
EXPOSE 3000

# Run in development mode
CMD [ "npm", "run", "dev" ]
