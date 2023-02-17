FROM alpine:latest

WORKDIR /root/juno/

ARG JUNO_TAR
RUN echo ${JUNO_TAR}
COPY ${JUNO_TAR} .
RUN apk add unzip --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main && \
    wget https://dl.google.com/go/go1.20.1.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.20.1.linux-amd64.tar.gz && \
    wget https://github.com/brendangregg/FlameGraph/archive/refs/heads/master.zip && \
    mkdir -p /home/www/system/pprof/ && \
    unzip master.zip -d /home/www/system/pprof/ && \
    apk add graphviz --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main && \
    cd /root/juno && tar xvf ${JUNO_TAR} && \
    mv /root/juno/juno-admin /usr/local/bin/ && \
    ls -al /root/juno/ && \
    ls -al /usr/local/bin/ && \
    rm ${JUNO_TAR} juno-proxy

ENV PATH /usr/local/go/bin:/home/www/system/pprof/FlameGraph-master:$PATH

EXPOSE 50002 50004 50010

CMD ["/usr/local/bin/juno-admin", "--config=./config/single-region-admin.toml", "-host=0.0.0.0"]