FROM alpine:latest

WORKDIR /root/juno/

ARG JUNO_TAR

RUN echo ${JUNO_TAR}
COPY ${JUNO_TAR} .
RUN cd /root/juno && tar xvf ${JUNO_TAR} && \
    mv /root/juno/juno-admin /usr/local/bin/ && \
    ls -al /root/juno/ && \
    ls -al /usr/local/bin/ && \
    rm ${JUNO_TAR} juno-proxy

EXPOSE 50002 50004 50010

CMD ["/usr/local/bin/juno-admin", "--config=./config/single-region-admin.toml", "-host=0.0.0.0"]