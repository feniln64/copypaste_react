# docker file for reactjs
FROM node:18.16-slim as builder
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:1.21.1-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]