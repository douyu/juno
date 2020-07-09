#!/usr/bin/env bash

RELEASE_PATH=${1:?"release path"}
for dir in $(ls ${RELEASE_PATH})
do
echo $dir
#     [ -d $dir ] && echo $dir
done
