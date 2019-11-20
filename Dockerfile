FROM node:10 as builder
RUN npm install && \
  npm run build
FROM nginx:alpine
COPY --from=builder dist/ /usr/share/nginx/html/
COPY nginx/ /etc/nginx/conf.d/
EXPOSE 80
