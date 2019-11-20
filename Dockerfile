FROM node:10 as builder
RUN pwd && \
  ls && \
  npm install && \
  npm run build
FROM nginx:alpine
COPY --from=builder dist/ /usr/share/nginx/html/
COPY nginx/ /etc/nginx/conf.d/
EXPOSE 80
