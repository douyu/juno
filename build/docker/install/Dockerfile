FROM centos

# Maintainer's information
MAINTAINER douyu <douyu.com>

# copy file
ADD . /home/www/server/douyu-juno-install
RUN chmod -R 775 /home/www/server/douyu-juno-install/bin
RUN chmod -R 775 /home/www/server/douyu-juno-install/wait-for-it.sh

RUN cd /home/www/server/douyu-juno-install && ls -l

WORKDIR /home/www/server/douyu-juno-install

CMD ["./wait-for-it.sh", "mysql:3306", "--",  "/home/www/server/douyu-juno-install/bin/douyu-juno-install","--config=./config/install.toml"]
