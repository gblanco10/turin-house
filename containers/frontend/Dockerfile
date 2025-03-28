# Costruzione del frontend con Node.js
FROM node:18 as build-stage

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Costruisce il frontend in modalità produzione
RUN npm run build

# Servizio statico con NGINX
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Espone la porta per servire l'app
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
