FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# ENTRYPOINT ["npm", "run", "preview", "--", "--port", "5173", "--host", "0.0.0.0"]
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY nginx.conf /etc/nginx/nginx.conf 
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
