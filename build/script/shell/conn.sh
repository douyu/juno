#!/bin/bash

# show connections of specific port.
# usage:./conn.sh 6379
# usage:./conn.sh "6379/|6399"

if [ -n "$1" ];then
    for (( i = 0;  ; i ++ ))
    do
        echo "Connections of port $1 is : "$(netstat -ano | grep $1 | wc -l)
        sleep 0.5s
    done
else
    echo "Port needed!"
fi
