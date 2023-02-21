FROM alpine:latest

WORKDIR /root/juno/

COPY --from=golang:1.19-alpine /usr/local/go/bin/go /usr/local/go/bin/go
COPY --from=golang:1.19-alpine /usr/local/go/pkg/tool/linux_amd64/pprof /usr/local/go/pkg/tool/linux_amd64/pprof

ARG JUNO_TAR

RUN echo ${JUNO_TAR}
COPY ${JUNO_TAR} .
RUN cd /root/juno && tar xvf ${JUNO_TAR} && \
    apk add unzip --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main && \
    wget https://github.com/brendangregg/FlameGraph/archive/refs/heads/master.zip && \
    mkdir -p /home/www/system/pprof/ && \
    unzip master.zip -d /home/www/system/pprof/ && \
    rm master.zip && \
    apk add graphviz --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main && \
    cd /root/juno && tar xvf ${JUNO_TAR} && \
    mv /root/juno/juno-admin /usr/local/bin/ && \
    ls -al /root/juno/ && \
    ls -al /usr/local/bin/ && \
    rm ${JUNO_TAR} juno-proxy

ENV PATH /usr/local/go/bin:/home/www/system/pprof/FlameGraph-master:$PATH

EXPOSE 50002 50004 50010

CMD ["/usr/local/bin/juno-admin", "--config=./config/single-region-admin.toml"]
