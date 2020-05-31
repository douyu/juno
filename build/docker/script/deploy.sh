#!/bin/bash

version="latest"
echo "version:" $version

docker push mixmore/juno-nginx:$version \
&& docker push mixmore/juno-install:$version \
&& docker push mixmore/juno:$version \
&& docker push mixmore/file-watch-demo:$version \
&& docker push mixmore/http-watch-demo:$version \
