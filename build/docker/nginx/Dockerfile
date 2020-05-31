FROM nginx:stable

# Maintainer's information
MAINTAINER douyu <douyu.com>

COPY juno.com.conf /etc/nginx/conf.d/default.conf


EXPOSE 8080

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]

