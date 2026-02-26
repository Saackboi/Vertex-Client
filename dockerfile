# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Inyectamos las variables (esto es para que el build de Angular las tome)
ARG API_URL
ARG SIGNALR_URL
RUN sed -i "s|URL_DE_LA_API|$API_URL|g" src/environments/environment.ts
RUN sed -i "s|URL_DEL_SERVIDOR_SIGNALR|$SIGNALR_URL|g" src/environments/environment.ts
RUN npm run build --configuration=production

# Etapa 2: Servidor Nginx
FROM nginx:stable-alpine
# Copiamos el build de Angular a Nginx
COPY --from=build /app/dist/Client2/browser /usr/share/nginx/html
# Copiamos una configuración de Nginx para manejar rutas de Angular (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]