#stage 1
FROM node:16.14.2 as node

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build --prod

#stage 2
FROM nginx:alpine
COPY --from=node /usr/src/app/dist/enlink /usr/share/nginx/html
EXPOSE 80

# FROM node:16.14.2 as node
# WORKDIR /app
# COPY . .
# RUN npm install @angular/cli && npm install && npm run build
# #stage 2
# FROM nginx:alpine
# COPY --from=node /app/dist/enlink /usr/share/nginx/html
# EXPOSE 80

# FROM node:16.14.2 AS ui-build
# WORKDIR /app  #ng build --prod
# COPY . .
# RUN npm install @angular/cli && npm install && npm run build

# FROM node:16.14.2 AS server-build
# WORKDIR /root/
# COPY --from=ui-build /app/dist/enlink /usr/share/nginx/html
# COPY package*.json ./
# RUN npm install
# COPY server.js .

# EXPOSE 3080 80

# CMD ["node", "server.js"]
