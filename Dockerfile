# Stage 1: Builder
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .

# Build + export static files → output ke /app/out
RUN bun run build

# Stage 2: Nginx untuk serve static files
FROM nginx:alpine AS runner

# Copy hasil static export ke Nginx html directory
# Next.js static export outputnya di /out (bukan /dist seperti V`ite)
COPY --from=builder /app/out /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]