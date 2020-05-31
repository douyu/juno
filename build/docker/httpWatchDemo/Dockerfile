FROM woahbase/alpine-supervisor

# Maintainer's information
MAINTAINER douyu <douyu.com>

# set env
ENV REGION_CODE=cn-wuhan \
    REGION_NAME=武汉 \
    ZONE_CODE=cn-wuhan-guanggu-f1 \
    ZONE_NAME=武汉光谷可用区F1 \
    JUPITER_HOST=http-watch-demo-host \
    APP_ENV=live

# copy file
ADD . /home/www/server

RUN chmod -R 775 /home/www/server/juno-agent/bin
RUN chmod -R 775 /home/www/server/client/bin

COPY ./conf.d/client.ini /etc/supervisor.d/client.ini
RUN cd /etc/supervisor.d/ && ls -l
ENTRYPOINT ["supervisord"]

CMD ["--nodaemon","--configuration","/etc/supervisord.conf"]


