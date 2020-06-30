#!/bin/bash
# get vcs revision number

basePath=$(dirname $(dirname $(dirname $(dirname $(readlink -f $0)))))
cd ${basePath}

# get git md5
gitSha1=$(git rev-parse HEAD)
echo $(expr substr ${gitSha1} 1 8)

