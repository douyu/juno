#!/bin/bash

export PATH=$PATH:/tmp/graphviz-2.44.0/usr/local/bin

echo "--- 检测graphviz环境"
dot -V
if [[ $? == 0 ]]
 then
   echo "        [success]"
   exit 0
  else
   echo "        [error]"
   echo "        [exit] graphviz 没有安装"
   #source ~/.bash_profile
   exit 1
fi

