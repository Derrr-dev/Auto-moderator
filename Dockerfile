FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install ALL dependencies (including devDeps for TypeScript)
RUN npm ci --no-fund --no-audit

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run build

# Start the bot
CMD ["node", "dist/index.js"]
