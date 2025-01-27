FROM node:18-alpine AS deps
WORKDIR /app

# Copy only package files to leverage Docker cache
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy all project files
COPY . .

# Generate GraphQL types and create production build
RUN npm run generate \
    && npm run build

FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Copy only the necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
