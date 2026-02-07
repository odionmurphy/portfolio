# Multi-stage Dockerfile: build frontend, install backend, run backend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY public ./public
COPY src ./src
COPY package.json ./package.json
RUN npm install
RUN npm run build

# Install backend deps
FROM node:18-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./backend/
COPY backend ./backend
# Copy frontend build from builder
COPY --from=builder /app/dist ./dist
WORKDIR /app/backend
RUN npm install --production
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
