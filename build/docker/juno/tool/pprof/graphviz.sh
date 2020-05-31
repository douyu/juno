#!/bin/bash

export PATH=$PATH:/tmp/graphviz-2.44.0/usr/local/bin

echo "[步骤1] 检测graphviz环境是否安装"
dot -V
if [[ $? == 0 ]]
 then
   echo "        [success]"
   exit 0  # already exist, no need install
fi

echo "[步骤2] tar zxvf tool/pprof/graphviz-2.44.0.tar.gz -C /tmp"
tar zxvf tool/pprof/graphviz-2.44.0.tar.gz -C /tmp
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] tar zxvf pprof/graphviz-2.44.0.tar.gz error"
   #source ~/.bash_profile
   exit 1
fi

echo "[步骤3] cd /tmp/graphviz-2.44.0"
cd /tmp/graphviz-2.44.0
if [[ $? == 0 ]]
 then
   echo "        [success]" #  go get -v github.com/uber/go-torch 执行成功"
 else
   echo "        [error]" #  go get -v github.com/uber/go-torch 执行失败"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

# 不能直接安装装/usr/local 没有权限，里面有remove操作 lib库安装又限定了/usr/local结尾 所以安装在/tmp/graphviz-2.44.0/usr/local
echo "[步骤4] mkdir usr"
if [[ ! -d /usr/ ]]
then
mkdir usr
fi
if [[ $? == 0 ]]
 then
   echo "        [success]"
 else
   echo "        [error]"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "[步骤5] mkdir usr/local"
if [[ ! -d /usr/local/ ]]
then
mkdir usr/local
fi
if [[ $? == 0 ]]
 then
   echo "        [success]"
 else
   echo "        [error]"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

# 指定安装前缀
echo "[步骤6] ./configure --prefix=/tmp/graphviz-2.44.0/usr/local"
./configure --prefix=/tmp/graphviz-2.44.0/usr/local
if [[ $? == 0 ]]
 then
   echo "        [success]"
 else
   echo "        [error]"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "[步骤7] make"
make
if [[ $? == 0 ]]
 then
   echo "        [success]"
 else
   echo "        [error]"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "[步骤8] make install"
make install
if [[ $? == 0 ]]
 then
   echo "        [success]"
 else
   echo "        [error]"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "[步骤9] dot -V"
dot -V

if [[ $? == 0 ]]
 then
   echo "        [success]"
 else
   echo "        [error]"
   echo "        [exit] 命令没有成功执行，提前退出"
   exit 1
fi

echo "all option success!!!"
#export
echo "---------------"




