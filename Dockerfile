#stage 1
FROM node:16.14.2 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod
#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/enlink /usr/share/nginx/html
