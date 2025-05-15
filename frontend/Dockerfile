# Use Bun base image
FROM oven/bun:1.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN bun install

# Copy the rest of the app
COPY . .

# Expose port 5173 for Vite
EXPOSE 5173

# Start Vite dev server with Bun
CMD ["bun", "run", "dev", "--", "--host", "0.0.0.0"]