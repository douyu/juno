# 快速开始

juno 提供了项目快速启动的方式:

## 启动

### 物理机
1. 前期准备
需要再本地环境准备
- Go
- MySQL
- ETCD

2. 初始化运行环境
```
make install
```

2. 项目运行
```
make run
```

### docker
以下两种可选方式进行服务启动：

- 使用[https://hub.docker.com/](https://hub.docker.com/)上远程的镜像，在项目根目录下执行。
```
make docker
```

- 使用本地代码进行编译本地镜像，在项目根目录下执行。
```
make docker.build.run
```
## 访问

[http://127.0.0.1:50000](http://127.0.0.1:50000)
