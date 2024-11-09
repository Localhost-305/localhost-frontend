# FROM node:20 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# ENTRYPOINT ["npm", "run", "preview", "--", "--port", "5173", "--host", "0.0.0.0"]
# FROM nginx:alpine
# WORKDIR /usr/share/nginx/html
# RUN rm -rf *
# COPY nginx.conf /etc/nginx/nginx.conf 
# COPY --from=build /app/dist .
# EXPOSE 80
# ENTRYPOINT ["nginx", "-g", "daemon off;"]


# Etapa de build (compilação do projeto React)
FROM node:20 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa de execução (servir os arquivos estáticos)
FROM node:20-slim

WORKDIR /app

# Instalar o 'serve' para servir o frontend
RUN npm install -g serve

# Copiar os arquivos buildados do container anterior
COPY --from=build /app/dist /app

# Expor a porta onde o React será servido
EXPOSE 80

# Comando para iniciar o servidor de arquivos estáticos
CMD ["serve", "-s", "dist", "-l", "80"]
