#!/bin/bash

export PATH=$PATH:/tmp/graphviz-2.44.0/usr/local/bin

if [ $# -ne 2 ]
then
      echo "arguments error, must 2 arg!"
      exit 1
fi

echo "[步骤1] 检测graphviz环境是否安装"
dot -V
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] 没有graphviz环境，提前退出"
   #source ~/.bash_profile
   exit 1
fi

echo "[步骤2] 检测Go环境是否安装"
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


echo "[步骤3] 安装go-torch工具(依赖Go环境): go get -v github.com/uber/go-torch"
# go env
go version
# go get -v github.com/uber/go-torch
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi
echo "[步骤4] FlameGraph:  cp -R tool/pprof/FlameGraph /tmp"
cp -R tool/pprof/FlameGraph /tmp
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "[步骤5] FlameGraph:  chmod 777  /tmp/FlameGraph/*"
chmod 777  /tmp/FlameGraph/*
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "[步骤6] FlameGraph:  export PATH=$PATH:/tmp/FlameGraph"
export PATH=$PATH:/tmp/FlameGraph
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "[步骤7] go tool pprof -svg $1 > $2"
go tool pprof -svg $1 > $2
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "[步骤8] go-torch -b $1 -p > $2_hy.svg"
go-torch -b $1 -p > $2_hy.svg
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "all option success!!!"
#export
echo "---------------"




