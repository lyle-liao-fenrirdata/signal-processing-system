FROM nginx:latest

RUN mkdir -p /etc/nginx/ssl/

# 在容器中生成自簽SSL憑証
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx-selfsigned.key -out /etc/nginx/ssl/nginx-selfsigned.crt -subj "/C=TW/ST=Taipei/L=Taipei/O=Organization/CN=localhost"

# 複製NGINX配置文件到容器中
COPY nginx.conf /etc/nginx/conf.d/default.conf