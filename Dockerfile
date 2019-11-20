FROM node:10 as builder
RUN npm install && \
  npm run build
FROM nginx:alpine
COPY --from=builder dist/ /usr/share/nginx/html/
VOLUME /etc/nginx/conf.d/
EXPOSE 80
