#!/usr/bin/env bash

APP_NAME=${1:?"app name"}
APP_VERSION=${2:?"app version"}
BASE_PATH=${3:?"base path"}
RELEASE_PATH=${4:?"release path"}

#DIRINFO=${DIRINFO:-""}
#SCRIPTPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
#
#
#if [[ -z ${DIRINFO} ]];then
#    DIRINFO=$(mktemp)
#    "${SCRIPTPATH}/folder.sh"  ${RELEASE_PATH}> "${DIRINFO}"
#fi
#
#while read -r line; do
#    cp -r ${BASE_PATH}/config ${RELEASE_PATH}/$line
#    cp -r ${BASE_PATH}/data ${RELEASE_PATH}/$line
#    cp -r ${BASE_PATH}/assets/dist ${RELEASE_PATH}/$line
#done < "${DIRINFO}"
PUB_TAR=${RELEASE_PATH}/${APP_NAME}_data_${APP_VERSION}.tar.gz
PUB_ZIP=${RELEASE_PATH}/${APP_NAME}_data_${APP_VERSION}.zip
tar zcf ${PUB_TAR} ./config ./data ./assets/dist
zip -r ${PUB_ZIP} ./config ./data ./assets/dist
echo ${PUB_TAR}
echo ${PUB_ZIP}
