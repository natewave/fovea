# syntax=docker/dockerfile:1
FROM node:24-slim AS build
WORKDIR /app
ENV PNPM_HOME=/pnpm PATH="/pnpm:$PATH"
RUN npm install --global pnpm@10
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
RUN pnpm install --frozen-lockfile && pnpm build

FROM nginx:1.27-alpine
COPY --from=build /app/site/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
