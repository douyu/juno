#!/bin/bash

basepath=$(cd `dirname $0`; pwd)
version="latest"


echo $basepath
echo "version:" $version


rm -rf ./build/docker/juno/assets/dist \
&& cp -R ./assets/dist ./build/docker/juno/assets/dist \
&& echo "frontend success" \


rm -rf ./build/docker/install/cmd \
&& mkdir -p ./build/docker/install/cmd/install \
&& cp -R ./cmd/install/mockdata ./build/docker/install/cmd/install/mockdata \
&& CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ./build/docker/install/bin/douyu-juno-install ./cmd/install/main.go \
&& echo "build install success" \


CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ./build/docker/juno/bin/douyu-juno ./cmd/admin/main.go \
&& echo "build juno success" \

rm -rf ./build/docker/fileWatchDemo/juno-agent
cp -R ./build/docker/juno-agent ./build/docker/fileWatchDemo/juno-agent
rm -rf ./build/docker/httpWatchDemo/juno-agent
cp -R ./build/docker/juno-agent ./build/docker/httpWatchDemo/juno-agent


rm -rf ./build/docker/juno/tool
mkdir -p ./build/docker/juno/tool
cp -R ./tool/pprof ./build/docker/juno/tool/pprof


docker build -t mixmore/juno-nginx:$version $basepath/../nginx/. \
&& docker build -t mixmore/juno-install:$version $basepath/../install/. \
&& docker build -t mixmore/juno:$version $basepath/../juno/. \
&& docker build -t mixmore/file-watch-demo:$version $basepath/../fileWatchDemo/. \
&& docker build -t mixmore/http-watch-demo:$version $basepath/../httpWatchDemo/.


docker-compose -f $basepath/../standalone.yaml up -d



