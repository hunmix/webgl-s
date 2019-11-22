FROM node:10 as builder
WORKDIR /app
COPY . /app
RUN npm install && \
  npm run build
FROM nginx:alpine
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY --from=builder /app/nginx/ /etc/nginx/conf.d/
EXPOSE 80
