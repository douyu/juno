# Deployment

## 一键启动

### Kubernetes

```bash
kubectl apply -f overlays/dev-mirror
```

## 访问

访问 [http://localhost:50002](http://localhost:50002)

使用如下账号进行登录 Juno

```txt
username: admin
password: admin
```

## 相关中间件

| 中间件             | 地址                                             | 备注        |
| ------------------ | ------------------------------------------------ | ----------- |
| etcd               | [localhost:2379](localhost:2379)                 |
| redis              | [localhost:6379](localhost:6379)                 |
| mysql              | [localhost:3306](localhost:3306)                 | root/root   |
| mysql-admin        | [http://localhost:8080](http://localhost:8080)   |             |
| clickhouse         | [localhost:9000](localhost:9000)                 |
| grafana            | [http://localhost:3000](http://localhost:3000)   | admin/admin |
| prometheus         | [http://localhost:9090](http://localhost:9090)   |
| rocketmq           | [localhost:9876](localhost:9876)                 |
| rocketmq-dashboard | [http://localhost:19876](http://localhost:19876) |
| juno-admin         | [http://localhost:50002](http://localhost:50002) | admin/admin |
| juno-agent         | [http://localhost:50010](http://localhost:50010) |
| jaeger             | [http://localhost:16686](http://localhost:16686) |
| otel-collector     | [localhost:4317](localhost:4317)                 |
| uptrace            | [http://localhost:14318](http://localhost:14318) |
