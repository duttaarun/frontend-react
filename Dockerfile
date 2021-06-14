FROM node:14.17.0-alpine
RUN mkdir -p /app && mkdir -p /run/nginx/ && \
        mkdir -p /var/www/html

WORKDIR /app

RUN apk update && apk add curl && apk add nginx-mod-http-headers-more && apk add --no-cache nginx && \
    rm -rf /var/cache/apk/* && \
    chown -R nginx:nginx /var/www/html && \
    chown -R nginx:nginx /run/nginx
    
COPY . /app

RUN cp nginx.conf /etc/nginx/conf.d/default.conf
RUN npm set strict-ssl false
RUN npm install
RUN npm run build
RUN cp -rf ./build/ /var/www/html/build && \
    chown -R nginx:nginx /var/www/html/build
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
