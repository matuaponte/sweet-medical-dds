# ─────────────────────────────────────────────
# Stage 1 — BUILD 🛠️🛠️🛠️🛠️
# Compila la app React en archivos estáticos
# ─────────────────────────────────────────────

# agarramos una imagen liviana de node
FROM node:20-alpine AS build

# directorio base
WORKDIR /app

COPY package*.json ./

# instalamos todas las dependencias
RUN npm install

# copiamos el codigo fuente
COPY . .

# compilamos la app
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2 — SERVE
# Sirve los archivos estáticos con nginx alpine
# La imagen final NO contiene Node.js ni el código fuente
# ─────────────────────────────────────────────

FROM nginx:alpine

# copiar el resultado del build al directorio web de nginx
COPY --from=build /app/build /usr/share/nginx/html

# Script de inyección de variables de entorno en runtime.
# nginx:alpine ejecuta automáticamente todos los scripts en
# /docker-entrypoint.d/ antes de arrancar nginx.
# Permite cambiar REACT_APP_API_URL desde Portainer sin rebuildar la imagen.
COPY env.sh /docker-entrypoint.d/40-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-env-config.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]