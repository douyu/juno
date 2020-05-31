#!/bin/bash

echo "--- 检测go-torch环境"
go-torch -h
if [[ $? == 0 ]]
 then
   echo "        [success]"
   exit 0
  else
   echo "        [error]"
   echo "        [exit] go-torch 没有安装"
   #source ~/.bash_profile
   exit 1
fi




