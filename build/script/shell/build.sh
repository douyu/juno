#!/bin/bash

set -e
basePath=$(dirname $(dirname $(dirname $(dirname $(readlink -f $0)))))
echo -e "\nBuilding binaries in ${basePath}"

cd ${basePath}
rm -rf ./bin/*

export GO111MODULE=on
export GOSUMDB=off
export GOPROXY="https://goproxy.cn/,direct"

if [ -d "${basePath}/cmd" ];then
    for file in ${basePath}/cmd/*; do
        echo building ${file}...
        echo pkgPath:${file}, binName:$(basename  $file)
        cd ${file}
        go build -ldflags "$1" -o ${basePath}/bin/$(basename  $file)
        echo -e "install success \n"
        echo -e "\n"
    done
fi
