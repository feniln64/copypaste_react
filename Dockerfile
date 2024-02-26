FROM node:18.16-slim as build
WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
