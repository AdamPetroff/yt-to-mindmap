# /backend/Dockerfile.dev
FROM node:16

# Python dependencies (if required)
RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /usr/src/app

# Before running the server, you might need to install any Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Install both production and development dependencies
COPY package*.json ./
RUN npm install

# Copy source files and TypeScript config
COPY . .

# Expose the server port
EXPOSE 3001

# Start the server with nodemon
CMD [ "npm", "start" ]
