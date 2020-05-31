#!/bin/bash

echo "[步骤1] 检测Go环境是否安装"
go version
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] 没有go环境，提前退出"
   #source ~/.bash_profile
   exit 1
fi


echo "[步骤2] 安装go-torch工具(依赖Go环境): go get -v github.com/uber/go-torch"
go get -v github.com/uber/go-torch
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "[步骤3] 检测go-torch环境"
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




