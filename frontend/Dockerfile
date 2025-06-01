FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# Copia da ciò che viene creato dal builder da app/dist dove cioè c'è l'app creata e lo butta dentro /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html


EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
