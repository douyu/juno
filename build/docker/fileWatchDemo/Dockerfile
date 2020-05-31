FROM woahbase/alpine-supervisor

# Maintainer's information
MAINTAINER douyu <douyu.com>

# set env
ENV REGION_CODE=cn-wuhan \
    REGION_NAME=武汉 \
    ZONE_CODE=cn-wuhan-guanggu-f3 \
    ZONE_NAME=武汉光谷可用区F3 \
    JUPITER_HOST=file-watch-demo-host \
    APP_ENV=dev

# copy file
ADD . /home/www/server

RUN chmod -R 775 /home/www/server/juno-agent/bin
RUN chmod -R 775 /home/www/server/client/bin

COPY ./conf.d/client.ini /etc/supervisor.d/client.ini
COPY ./client/config/config-dev.toml /tmp/www/server/douyu-edogawa-konan/config/config-dev.toml

RUN cd /etc/supervisor.d/ && ls -l

ENTRYPOINT ["supervisord"]
CMD ["--nodaemon","--configuration","/etc/supervisord.conf"]


