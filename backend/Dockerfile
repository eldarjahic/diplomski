# Base image
FROM node:20

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install deps
COPY package.json ./
# RUN npm install

# Copy source code
COPY . .

RUN npm install -g ts-node-dev


# Build TS -> JS
# RUN npm run build

# Expose port
EXPOSE 3000

# Run app
# CMD ["node", "dist/index.js"]
CMD ["npm", "run", "dev"]
