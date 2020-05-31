#!/bin/bash

echo "--- 检测golangz环境"
go version
if [[ $? == 0 ]]
 then
   echo "        [success]"
   exit 0
  else
   echo "        [error]"
   echo "        [exit] golang 没有安装"
   #source ~/.bash_profile
   exit 1
fi




