# Multi-stage Dockerfile for Audio Text Frontend
# Supports: development and production builds

# ============================================================================
# BASE STAGE - Common dependencies for all variants
# ============================================================================
FROM node:22-alpine AS base

WORKDIR /app

# Update packages for security
RUN apk update && apk upgrade

# Copy package files for better layer caching
COPY package*.json ./

# ============================================================================
# DEVELOPMENT STAGE - Dev server with hot reload
# ============================================================================
FROM base AS dev

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 3202

# Start the development server
CMD ["npm", "run", "start"]

# ============================================================================
# BUILDER STAGE - Build production static files
# ============================================================================
FROM base AS builder

# Install ALL dependencies (including devDependencies for build tools)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Build the application with production optimizations
RUN npm run build

# ============================================================================
# PRODUCTION STAGE - Nginx serving static files
# ============================================================================
FROM nginx:alpine AS production

# Copy built static files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY ./nginx/nginx-prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
