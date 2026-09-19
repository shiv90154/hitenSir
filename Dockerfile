FROM node:22-slim
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
# The build pre-renders pages from the database, so it runs at startup (after Postgres is healthy), not at image build.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run build && NODE_ENV=production npm run start"]
