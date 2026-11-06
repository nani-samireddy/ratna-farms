FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY next.config.mjs ./
COPY app/ ./app/
COPY components/ ./components/
COPY lib/ ./lib/
COPY public/ ./public/
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/out/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
