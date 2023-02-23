![logo](docs/logo.png)

# JUNO - A distributed application management system

[![Build Status](https://travis-ci.org/douyu/juno.svg?branch=master)](https://travis-ci.org/douyu/juno)
[![codecov](https://codecov.io/gh/douyu/juno/branch/master/graph/badge.svg)](https://codecov.io/gh/douyu/juno)
[![go.dev reference](https://img.shields.io/badge/go.dev-reference-007d9c?logo=go&logoColor=white&style=flat-square)](https://pkg.go.dev/github.com/douyu/juno?tab=doc)
[![Go Report Card](https://goreportcard.com/badge/github.com/douyu/juno)](https://goreportcard.com/report/github.com/douyu/juno)
![license](https://img.shields.io/badge/license-Apache--2.0-green.svg)<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-15-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Introduction

JUNO（朱诺） 是斗鱼数据服务组研发的分布式服务管理系统，核心功能为配置中心，能集中化管理应用不同环境、不同机房的配置；并且集成了监控中心、测试平台、日志中心等功能模块，采用Casbin进行规范化的权限管理，适用于微服务生命周期管理。

## Documentation

更多产品介绍参见 [Juno微服务治理系统介绍](http://jupiter.douyu.com/juno)

## Quick Start with Kubernetes

### Mirror Image（推荐国内走阿里云拉取镜像）

```bash
echo -e 'docker pull registry.cn-hangzhou.aliyuncs.com/sophos/quay.io.coreos.etcd:v3.3\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/quay.io.coreos.etcd:v3.3 quay.io/coreos/etcd:v3.3\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/curlimages.curl:7.88.1\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/curlimages.curl:7.88.1 curlimages/curl:7.88.1\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/redis:6.2-alpine\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/redis:6.2-alpine redis:6.2-alpine\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/ghcr.io.douyu.juno-agent-dev:latest\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/ghcr.io.douyu.juno-agent-dev:latest ghcr.io/douyu/juno-agent-dev:latest\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/jaegertracing.all-in-one:1.42\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/jaegertracing.all-in-one:1.42 jaegertracing/all-in-one:1.42\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/ghcr.io.douyu.exampleserver-dev:latest\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/ghcr.io.douyu.exampleserver-dev:latest ghcr.io/douyu/exampleserver-dev:latest\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/python:3.9-alpine\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/python:3.9-alpine python:3.9-alpine\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/adminer:4.8.1\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/adminer:4.8.1 adminer:4.8.1\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/ghcr.io.douyu.juno-admin-dev:latest\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/ghcr.io.douyu.juno-admin-dev:latest ghcr.io/douyu/juno-admin-dev:latest\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/grafana.grafana:9.3.6\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/grafana.grafana:9.3.6 grafana/grafana:9.3.6\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/prom.prometheus:v2.42.0\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/prom.prometheus:v2.42.0 prom/prometheus:v2.42.0\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/pyroscope.pyroscope:0.37.2\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/pyroscope.pyroscope:0.37.2 pyroscope/pyroscope:0.37.2\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/apacherocketmq.rocketmq:4.5.0\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/apacherocketmq.rocketmq:4.5.0 apacherocketmq/rocketmq:4.5.0\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/mysql:5.7\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/mysql:5.7 mysql:5.7\ndocker pull registry.cn-hangzhou.aliyuncs.com/sophos/apacherocketmq.rocketmq-dashboard:1.0.0\ndocker tag registry.cn-hangzhou.aliyuncs.com/sophos/apacherocketmq.rocketmq-dashboard:1.0.0 apacherocketmq/rocketmq-dashboard:1.0.0\n' | bash
```

### Install Juno

```bash
kubectl apply --server-side=true -f https://github.com/douyu/juno/releases/download/latest/install.yml
```

### Install Jupiter-Layout

```bash
kubectl apply -f https://github.com/douyu/jupiter-layout/releases/download/latest/install.yml
```



## Overview 
### [Monitor Dashboard]()
-----
Profile dashboard of app
[![monitorpyroscope](/docs/img/monitorpyroscope.png)](https://github.com/douyu/juno)
Overview metrics of app
[![monitoroverview](/docs/img/monitoroverview.png)](https://github.com/douyu/juno)
Instance metrics of app
[![monitorinstance](/docs/img/monitorinstance.png)](https://github.com/douyu/juno)
API metrics of app
[![monitorapi](/docs/img/monitorapi.png)](https://github.com/douyu/juno)
### [Pyroscope](https://github.com/pyroscope-io/pyroscope)
----
[![pyroscope](/docs/img/pyroscope.png)](https://github.com/douyu/juno)
### [Jaeger](https://github.com/jaegertracing/jaeger)
----
[![jaeger](/docs/img/jaeger.png)](https://github.com/douyu/juno)
## Bug and Feedback

For bug report, questions and discussions please submit GitHub Issues.

## Contribution

Please make sure to read the [CONTRIBUTING](CONTRIBUTING.md) before making a pull request.

Thanks for all the people who contributed to Juno！

## Contributors

<a href="https://github.com/douyu/juno/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=douyu/juno" />
</a>

## License

The project is licensed under the [Apache 2 license](https://github.com/ctripcorp/apollo/blob/master/LICENSE).

## Known Users

按照登记顺序排序，更多接入公司，欢迎在[https://github.com/douyu/juno/issues/43](https://github.com/douyu/juno/issues/43) 登记（仅供开源用户参考）

<table>
<tr>
<td>斗鱼</td>
</tr>
</table>
