# Use an official Node image with Debian so we can install native deps
FROM node:20-bullseye-slim AS base

# Install system dependencies needed by node-canvas
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libcairo2-dev \
    libpango1.0-0 \
    libpango1.0-dev \
    libjpeg62-turbo \
    libjpeg62-turbo-dev \
    libgif7 \
    libgif-dev \
    librsvg2-2 \
    librsvg2-dev \
    libpixman-1-0 \
    libpixman-1-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./ 2>/dev/null || true

# Install dependencies
# Prefer npm here; switch to pnpm/yarn if your project uses those
RUN npm ci --omit=dev || npm install --omit=dev

# Copy the rest of the app source
COPY . .

# Build the Next.js app
RUN npm run build

# --- Production runtime image (optional but recommended) ---
FROM node:20-bullseye-slim AS runner

# Install runtime libs for canvas (no dev headers needed now)
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    libpixman-1-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy node_modules and build output from builder
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/next.config.js ./next.config.js 2>/dev/null || true
COPY --from=base /app/next-env.d.ts ./next-env.d.ts 2>/dev/null || true

# Set env for production
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port Railway will use
EXPOSE 3000

# Use Next.js standalone start if configured, otherwise default
# If you use "output: 'standalone'" in next.config.js, adjust this to:
#   CMD ["node", "server.js"]
CMD ["npm", "start"]