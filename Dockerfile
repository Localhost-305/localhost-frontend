FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY nginx.conf /etc/nginx/nginx.conf 
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# docker run -d --name container-frontend --network network-api -p 80:80 ghcr.io/localhost-305/localhost-frontend/docker-image-frontend-test:latest