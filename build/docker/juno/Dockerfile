FROM golang:1.13

# Maintainer's information
MAINTAINER douyu <douyu.com>

# copy file
ADD . /home/www/server/douyu-juno
RUN chmod -R 775 /home/www/server/douyu-juno/bin
RUN chmod -R 775 /home/www/server/douyu-juno/wait-for-it.sh
RUN chmod -R 775 /home/www/server/douyu-juno/tool/pprof/*.sh

EXPOSE 50000 9091

WORKDIR /home/www/server/douyu-juno

RUN go get -v github.com/uber/go-torch
RUN ./tool/pprof/checkGo.sh
RUN ./tool/pprof/graphviz.sh

CMD ["./wait-for-it.sh", "mysql:3306", "--",  "/home/www/server/douyu-juno/bin/douyu-juno","--config=./config/admin.toml"]

