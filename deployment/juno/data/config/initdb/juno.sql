-- Adminer 4.8.1 MySQL 5.7.36 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `juno`;
CREATE DATABASE `juno` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */;
USE `juno`;

DROP TABLE IF EXISTS `access_token`;
CREATE TABLE `access_token` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `app_id` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `secret` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_id` (`app_id`),
  UNIQUE KEY `idx_unique_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `access_token` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `app_id`, `secret`) VALUES
(1,	'2023-02-08 05:43:01.498',	'2023-02-08 05:43:01.498',	NULL,	'API_TEST',	'LhoCOwiwBn2kzwxE',	'wiROR8O3FlT1ICoCw6mEfU9ZF04z53Eg');

DROP TABLE IF EXISTS `app`;
CREATE TABLE `app` (
  `aid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `gid` bigint(20) NOT NULL COMMENT 'gitlab id',
  `name` varchar(191) COLLATE utf8mb4_bin NOT NULL COMMENT '项目中文名',
  `app_name` varchar(191) COLLATE utf8mb4_bin NOT NULL COMMENT '项目英文唯一标识名',
  `create_time` bigint(20) NOT NULL COMMENT '创建时间',
  `update_time` bigint(20) NOT NULL COMMENT '更新时间',
  `level` bigint(20) NOT NULL COMMENT '层级',
  `lang` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '语言',
  `biz_domain` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '业务类型',
  `created_by` bigint(20) NOT NULL COMMENT '创建者',
  `updated_by` bigint(20) NOT NULL COMMENT '更新者',
  `http_port` longtext COLLATE utf8mb4_bin NOT NULL COMMENT 'HTTP端口号',
  `rpc_port` longtext COLLATE utf8mb4_bin NOT NULL COMMENT 'RPC端口号',
  `govern_port` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '治理端口号',
  `hook_id` bigint(20) NOT NULL COMMENT '钩子',
  `users` json NOT NULL COMMENT '业务负责人',
  `web_url` longtext COLLATE utf8mb4_bin NOT NULL,
  `proto_dir` longtext COLLATE utf8mb4_bin NOT NULL,
  `git_url` longtext COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`aid`),
  KEY `idx_app_name` (`name`),
  KEY `idx_app_app_name` (`app_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `app` (`aid`, `gid`, `name`, `app_name`, `create_time`, `update_time`, `level`, `lang`, `biz_domain`, `created_by`, `updated_by`, `http_port`, `rpc_port`, `govern_port`, `hook_id`, `users`, `web_url`, `proto_dir`, `git_url`) VALUES
(1,	1,	'juno-agent',	'juno-agent',	1673064118,	1675836081,	1,	'go',	'直播系统',	0,	0,	'8011',	'8012',	'9999',	0,	'[\"douyu\"]',	'https://github.com/douyu/juno-agent',	'',	'git@github.com/douyu/juno-agent.git'),
(2,	2,	'juno-admin',	'juno-admin',	1673064118,	1673064118,	1,	'go',	'直播系统',	0,	0,	'50002',	'0',	'50004',	0,	'[\"douyu\"]',	'https://github.com/douyu/juno',	'',	'git@github.com/douyu/juno.git'),
(3,	3,	'exampleserver',	'exampleserver',	1676633682,	1676633682,	1,	'go',	'直播系统',	0,	0,	'9527',	'9528',	'9529',	0,	'[\"douyu\"]',	'https://github.com/douyu/juno-layout',	'',	'https://github.com/douyu/juno-layout');

DROP TABLE IF EXISTS `app_change_map`;
CREATE TABLE `app_change_map` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app_name` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `md5` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `updated_at` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_app_change_map_app_name` (`app_name`),
  KEY `idx_app_change_map_md5` (`md5`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `app_change_map` (`id`, `app_name`, `md5`, `updated_at`) VALUES
(4,	'juno-admin',	'af66bc40d197e6b69c37a956d312dd5e',	1673064118);

DROP TABLE IF EXISTS `app_event`;
CREATE TABLE `app_event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app_name` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `aid` bigint(20) NOT NULL,
  `zone_code` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `env` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `host_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `operator_type` varchar(191) COLLATE utf8mb4_bin NOT NULL DEFAULT 'user',
  `user_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `uid` bigint(20) NOT NULL,
  `operation` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) DEFAULT NULL,
  `source` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `metadata` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_source` (`source`),
  KEY `idx_app_name` (`app_name`),
  KEY `idx_aid` (`aid`),
  KEY `idx_zone_code` (`zone_code`),
  KEY `idx_env` (`env`),
  KEY `idx_operation` (`operation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `app_log`;
CREATE TABLE `app_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '''应用id''',
  `aid` bigint(20) NOT NULL COMMENT '''应用id''',
  `gid` bigint(20) NOT NULL COMMENT '''gitlab id''',
  `name` varchar(191) COLLATE utf8mb4_bin NOT NULL COMMENT '''项目中文名''',
  `app_name` varchar(191) COLLATE utf8mb4_bin NOT NULL COMMENT '''项目英文唯一标识名''',
  `create_time` bigint(20) NOT NULL COMMENT '''创建时间''',
  `update_time` bigint(20) NOT NULL COMMENT '''更新时间''',
  `level` bigint(20) NOT NULL COMMENT '''层级''',
  `lang` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''语言''',
  `biz_domain` longtext COLLATE utf8mb4_bin NOT NULL,
  `created_by` bigint(20) NOT NULL COMMENT '''创建者''',
  `updated_by` bigint(20) NOT NULL COMMENT '''更新者''',
  `http_port` longtext COLLATE utf8mb4_bin NOT NULL,
  `rpc_port` longtext COLLATE utf8mb4_bin NOT NULL,
  `health_port` longtext COLLATE utf8mb4_bin NOT NULL,
  `hook_id` bigint(20) NOT NULL COMMENT '''钩子''',
  `users` json NOT NULL,
  `web_url` longtext COLLATE utf8mb4_bin NOT NULL,
  `action` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '''动作''',
  `created_at` datetime(3) DEFAULT NULL COMMENT '''记录创建时间''',
  PRIMARY KEY (`id`),
  KEY `idx_app_log_app_name` (`app_name`),
  KEY `idx_app_log_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `app_node`;
CREATE TABLE `app_node` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `aid` bigint(20) NOT NULL,
  `host_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `ip` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `device_id` bigint(20) NOT NULL,
  `env` longtext COLLATE utf8mb4_bin NOT NULL,
  `region_code` longtext COLLATE utf8mb4_bin NOT NULL,
  `region_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `zone_code` longtext COLLATE utf8mb4_bin NOT NULL,
  `zone_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) NOT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_app_node_ip` (`ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `app_node_map`;
CREATE TABLE `app_node_map` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `aid` bigint(20) DEFAULT NULL,
  `app_name` longtext COLLATE utf8mb4_bin,
  `md5` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `app_node_map` (`id`, `aid`, `app_name`, `md5`) VALUES
(11,	0,	'',	'29b799d89c788f64efc491e01a81aed2');

DROP TABLE IF EXISTS `app_package`;
CREATE TABLE `app_package` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `aid` bigint(20) NOT NULL,
  `name` longtext COLLATE utf8mb4_bin NOT NULL,
  `branch` longtext COLLATE utf8mb4_bin NOT NULL,
  `version` longtext COLLATE utf8mb4_bin NOT NULL,
  `revision` longtext COLLATE utf8mb4_bin NOT NULL,
  `packages` text COLLATE utf8mb4_bin NOT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `app_statics`;
CREATE TABLE `app_statics` (
  `aid` bigint(20) NOT NULL,
  `app_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `git_push` bigint(20) NOT NULL,
  `git_tag_push` bigint(20) NOT NULL,
  `git_issue` bigint(20) NOT NULL,
  `git_merge_request` bigint(20) NOT NULL,
  `git_wiki_page` bigint(20) NOT NULL,
  `git_pipeline` bigint(20) NOT NULL,
  `git_job` bigint(20) NOT NULL,
  `cmc_create` bigint(20) NOT NULL,
  `cmc_update` bigint(20) NOT NULL,
  `cmc_delete` bigint(20) NOT NULL,
  `app_create` bigint(20) NOT NULL,
  `app_update` bigint(20) NOT NULL,
  `app_delete` bigint(20) NOT NULL,
  `node_create` bigint(20) NOT NULL,
  `node_update` bigint(20) NOT NULL,
  `node_delete` bigint(20) NOT NULL,
  `pprof_create` bigint(20) NOT NULL,
  `devops_update` bigint(20) NOT NULL,
  `devops_register` bigint(20) NOT NULL,
  `devops_unregister` bigint(20) NOT NULL,
  `devops_start` bigint(20) NOT NULL,
  `devops_restart` bigint(20) NOT NULL,
  `devops_stop` bigint(20) NOT NULL,
  `devops_deploy` bigint(20) NOT NULL,
  `devops_rollback` bigint(20) NOT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `app_topology`;
CREATE TABLE `app_topology` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `aid` bigint(20) NOT NULL,
  `app_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `region_code` longtext COLLATE utf8mb4_bin NOT NULL,
  `zone_code` longtext COLLATE utf8mb4_bin NOT NULL,
  `env` longtext COLLATE utf8mb4_bin NOT NULL,
  `file_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `addr` longtext COLLATE utf8mb4_bin NOT NULL,
  `ip` longtext COLLATE utf8mb4_bin NOT NULL,
  `port` longtext COLLATE utf8mb4_bin NOT NULL,
  `name` longtext COLLATE utf8mb4_bin NOT NULL,
  `type` longtext COLLATE utf8mb4_bin NOT NULL,
  `info` longtext COLLATE utf8mb4_bin NOT NULL,
  `update_time` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  `extra` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `app_user_relation`;
CREATE TABLE `app_user_relation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `user_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `updated_at` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `app_view_history`;
CREATE TABLE `app_view_history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `uid` bigint(20) unsigned DEFAULT NULL,
  `aid` bigint(20) unsigned DEFAULT NULL,
  `app_name` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `board`;
CREATE TABLE `board` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` longtext COLLATE utf8mb4_bin NOT NULL,
  `src` longtext COLLATE utf8mb4_bin NOT NULL,
  `meta_data` json NOT NULL,
  `is_enable` tinyint(1) NOT NULL,
  `is_common` tinyint(1) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `updated_at` bigint(20) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_board_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `board_auth`;
CREATE TABLE `board_auth` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `did` bigint(20) NOT NULL,
  `uid` bigint(20) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `casbin_policy_auth`;
CREATE TABLE `casbin_policy_auth` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `sub` longtext COLLATE utf8mb4_bin NOT NULL,
  `obj` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `act` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `type` longtext COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `casbin_policy_group`;
CREATE TABLE `casbin_policy_group` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `group_name` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `uid` bigint(20) NOT NULL,
  `app_name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `app_env` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `type` longtext COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_casbin_policy_group_uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `casbin_policy_group` (`id`, `created_at`, `updated_at`, `deleted_at`, `group_name`, `uid`, `app_name`, `app_env`, `url`, `type`) VALUES
(1,	'2023-01-07 11:13:55.386',	'2023-01-07 11:13:55.386',	NULL,	'admin',	1,	'',	'',	'',	'user'),
(2,	'2023-01-07 11:13:55.487',	'2023-01-07 11:13:55.487',	NULL,	'default',	2,	'',	'',	'',	'user');

DROP TABLE IF EXISTS `cmc_tpl`;
CREATE TABLE `cmc_tpl` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tpl_type` longtext COLLATE utf8mb4_bin NOT NULL,
  `content` longtext COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) NOT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `configuration`;
CREATE TABLE `configuration` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `aid` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_bin,
  `format` varchar(20) COLLATE utf8mb4_bin DEFAULT NULL,
  `env` varchar(20) COLLATE utf8mb4_bin DEFAULT NULL,
  `zone` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `version` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `access_token_id` bigint(20) unsigned DEFAULT NULL,
  `uid` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `published_at` datetime(3) DEFAULT NULL,
  `lock_uid` bigint(20) unsigned DEFAULT NULL,
  `lock_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `configuration` (`id`, `aid`, `name`, `content`, `format`, `env`, `zone`, `version`, `created_at`, `access_token_id`, `uid`, `updated_at`, `deleted_at`, `published_at`, `lock_uid`, `lock_at`) VALUES
(1,	3,	'config-dev',	'[jupiter]\n  mode=\"dev\"\n\n  [jupiter.registry.default]\n    endpoints=[\"etcd:2379\"]\n    timeout=\"3s\"\n\n  [jupiter.logger.default]\n    # debug = true\n    level=\"info\"\n    dir=\"./logs/\"\n  [jupiter.logger.jupiter]\n    # debug = true\n    level=\"info\"\n    dir=\"./logs/\"\n\n  [jupiter.trace.jaeger]\n    endpoint=\"http://jaeger:14268/api/traces\"\n    sampler=1\n\n    # [jupiter.trace.otelgrpc]\n    #     endpoint = \"localhost:4317\"\n    #     sampler = 1\n\n[jupiter.server]\n  [jupiter.server.http]\n    port=9527\n  [jupiter.server.grpc]\n    port=9528\n  [jupiter.server.govern]\n    port=9529\n\n[jupiter.grpc]\n  [jupiter.grpc.example]\n    addr=\"etcd:///grpc:exampleserver:v1:dev\"\n    timeout=\"3s\"\n\n  [jupiter.mysql.example]\n    dsn=\"root:root@tcp(db:3306)/mysql?timeout=20s&readTimeout=20s\"\n    debug=true\n    maxIdleConns=50\n    connMaxLifeTime=\"20m\"\n    level=\"panic\"\n    slowThreshold=\"400ms\"\n    dialTimeout=\"1s\"\n\n  [jupiter.rocketmq.example]\n    [jupiter.rocketmq.example.consumer]\n      enable=true\n      addr=[\"namesrv:9876\"]\n      group=\"testGroup\"\n      dialTimeout=\"3s\"\n      rwTimeout=\"3s\"\n      topic=\"DefaultCluster\"\n      subExpression=\"*\"\n      rate=100\n      enableTrace=true\n    [jupiter.rocketmq.example.producer]\n      group=\"testGroup\"\n      addr=[\"namesrv:9876\"]\n      dialTimeout=\"3s\"\n      rwTimeout=\"3s\"\n      topic=\"DefaultCluster\"\n      enableTrace=true\n\n[jupiter.resty.example]\n  addr=\"http://exampleserver:9527\"\n\n[jupiter.redis.example]\n  [jupiter.redis.example.stub]\n    debug=false\n    maxIdle=10\n    maxActive=50\n    dialTimeout=\"2s\"\n    readTimeout=\"2s\"\n    idleTimeout=\"60s\"\n    enableAccessLog=false\n    [jupiter.redis.example.stub.master]\n      addr=\"redis://@redis:6379\"\n    [jupiter.redis.example.stub.slaves]\n      addr=[\"redis://@redis:6379\"]\n',	'toml',	'dev',	'cn-wuhan-guanggu-f1',	'2e609d0817d63d2298516d1a0b721a3e',	'2023-02-22 00:56:54.631',	0,	1,	'2023-02-27 11:57:31.562',	NULL,	NULL,	0,	NULL);

DROP TABLE IF EXISTS `configuration_cluster_status`;
CREATE TABLE `configuration_cluster_status` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `configuration_id` bigint(20) unsigned DEFAULT NULL,
  `configuration_publish_id` bigint(20) unsigned DEFAULT NULL,
  `cluster_name` longtext COLLATE utf8mb4_bin,
  `used` bigint(20) unsigned DEFAULT NULL,
  `synced` bigint(20) unsigned DEFAULT NULL,
  `take_effect` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `update_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `configuration_cluster_status` (`id`, `configuration_id`, `configuration_publish_id`, `cluster_name`, `used`, `synced`, `take_effect`, `created_at`, `update_at`) VALUES
(1,	1,	1,	'开发测试集群',	0,	0,	0,	'2023-02-22 00:57:23.436',	'2023-02-22 00:57:23.436'),
(2,	1,	2,	'开发测试集群',	0,	0,	0,	'2023-02-22 01:12:14.560',	'2023-02-22 01:12:14.560');

DROP TABLE IF EXISTS `configuration_history`;
CREATE TABLE `configuration_history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `access_token_id` bigint(20) unsigned DEFAULT NULL,
  `uid` bigint(20) unsigned DEFAULT NULL,
  `configuration_id` bigint(20) unsigned DEFAULT NULL,
  `change_log` longtext COLLATE utf8mb4_bin,
  `content` longtext COLLATE utf8mb4_bin,
  `version` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `configuration_history` (`id`, `access_token_id`, `uid`, `configuration_id`, `change_log`, `content`, `version`, `created_at`, `deleted_at`) VALUES
(1,	0,	1,	1,	'配置',	'[jupiter]\n  mode=\"dev\"\n  [jupiter.registry.default]\n    endpoints=[\"etcd:2379\"]\n    timeout=\"3s\"\n\n  [jupiter.logger.default]\n    # debug = true\n    level=\"info\"\n    dir=\"./logs/\"\n  [jupiter.logger.jupiter]\n    # debug = true\n    level=\"info\"\n    dir=\"./logs/\"\n\n  [jupiter.trace.jaeger]\n    endpoint=\"http://jaeger:14268/api/traces\"\n    sampler=1\n# [jupiter.trace.otelgrpc]\n#     endpoint = \"localhost:4317\"\n#     sampler = 1\n[jupiter.server]\n  [jupiter.server.http]\n    port=9527\n  [jupiter.server.grpc]\n    port=9528\n  [jupiter.server.govern]\n    port=9529\n\n[jupiter.grpc]\n  [jupiter.grpc.example]\n    addr=\"127.0.0.1:9528\"\n    timeout=\"3s\"\n  [jupiter.mysql.example]\n    dsn=\"root:root@tcp(db:3306)/mysql?timeout=20s&readTimeout=20s\"\n    debug=true\n    maxIdleConns=50\n    connMaxLifeTime=\"20m\"\n    level=\"panic\"\n    slowThreshold=\"400ms\"\n    dialTimeout=\"1s\"\n  [jupiter.rocketmq.example]\n    [jupiter.rocketmq.example.consumer]\n      enable=true\n      addr=[\"namesrv:9876\"]\n      group=\"testGroup\"\n      dialTimeout=\"3s\"\n      rwTimeout=\"3s\"\n      topic=\"DefaultCluster\"\n      subExpression=\"*\"\n      rate=100\n      enableTrace=true\n    [jupiter.rocketmq.example.producer]\n      group=\"testGroup\"\n      addr=[\"namesrv:9876\"]\n      dialTimeout=\"3s\"\n      rwTimeout=\"3s\"\n      topic=\"DefaultCluster\"\n      enableTrace=true\n\n[jupiter.resty.example]\n  addr=\"http://127.0.0.1:9527\"\n\n[jupiter.redis.example]\n  [jupiter.redis.example.stub]\n    debug=false\n    maxIdle=10\n    maxActive=50\n    dialTimeout=\"2s\"\n    readTimeout=\"2s\"\n    idleTimeout=\"60s\"\n    enableAccessLog=false\n    [jupiter.redis.example.stub.master]\n      addr=\"redis://@redis:6379\"\n    [jupiter.redis.example.stub.slaves]\n      addr=[\"redis://@redis:6379\"]\n',	'e0549cc536dce8024a06b94e031ba227',	'2023-02-22 00:57:20.890',	NULL);

DROP TABLE IF EXISTS `configuration_publish`;
CREATE TABLE `configuration_publish` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) DEFAULT NULL,
  `access_token_id` bigint(20) unsigned DEFAULT NULL,
  `configuration_id` bigint(20) unsigned DEFAULT NULL,
  `configuration_history_id` bigint(20) unsigned DEFAULT NULL,
  `apply_instance` longtext COLLATE utf8mb4_bin,
  `file_path` longtext COLLATE utf8mb4_bin,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `configuration_resource_relation`;
CREATE TABLE `configuration_resource_relation` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `configuration_history_id` bigint(20) unsigned DEFAULT NULL,
  `config_resource_value_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `configuration_status`;
CREATE TABLE `configuration_status` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `configuration_id` bigint(20) unsigned DEFAULT NULL,
  `configuration_publish_id` bigint(20) unsigned DEFAULT NULL,
  `host_name` longtext COLLATE utf8mb4_bin,
  `used` bigint(20) unsigned DEFAULT NULL,
  `synced` bigint(20) unsigned DEFAULT NULL,
  `take_effect` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `update_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `config_resource`;
CREATE TABLE `config_resource` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) unsigned DEFAULT NULL,
  `is_global` tinyint(1) DEFAULT NULL,
  `name` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `env` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `zone_code` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_bin,
  `visible` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `config_resource_tag`;
CREATE TABLE `config_resource_tag` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `config_resource_id` bigint(20) unsigned DEFAULT NULL,
  `value` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `config_resource_value`;
CREATE TABLE `config_resource_value` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `config_resource_id` bigint(20) unsigned DEFAULT NULL,
  `value` text COLLATE utf8mb4_bin,
  `created_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `cron_job`;
CREATE TABLE `cron_job` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext COLLATE utf8mb4_bin,
  `uid` bigint(20) unsigned DEFAULT NULL,
  `app_name` longtext COLLATE utf8mb4_bin,
  `env` longtext COLLATE utf8mb4_bin,
  `zone` longtext COLLATE utf8mb4_bin,
  `timeout` bigint(20) unsigned DEFAULT NULL,
  `retry_count` bigint(20) unsigned DEFAULT NULL,
  `retry_interval` bigint(20) unsigned DEFAULT NULL,
  `script` longtext COLLATE utf8mb4_bin,
  `enable` tinyint(1) DEFAULT NULL,
  `nodes` json DEFAULT NULL,
  `job_type` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `cron_job_timer`;
CREATE TABLE `cron_job_timer` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `job_id` bigint(20) unsigned DEFAULT NULL,
  `cron` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `cron_task`;
CREATE TABLE `cron_task` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) unsigned DEFAULT NULL,
  `node` longtext COLLATE utf8mb4_bin,
  `env` longtext COLLATE utf8mb4_bin,
  `zone` longtext COLLATE utf8mb4_bin,
  `status` longtext COLLATE utf8mb4_bin,
  `timeout` bigint(20) unsigned DEFAULT NULL,
  `executed_at` datetime(3) DEFAULT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `retry_count` bigint(20) unsigned DEFAULT NULL,
  `log` longtext COLLATE utf8mb4_bin,
  `script` longtext COLLATE utf8mb4_bin,
  `execute_type` bigint(20) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cron_task_job_id` (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `example_models`;
CREATE TABLE `example_models` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_example_models_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `grpc_proto`;
CREATE TABLE `grpc_proto` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `app_name` bigint(20) DEFAULT NULL,
  `file_name` longtext COLLATE utf8mb4_bin,
  `package_name` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `grpc_proto_service`;
CREATE TABLE `grpc_proto_service` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `proto_id` bigint(20) unsigned DEFAULT NULL,
  `name` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `grpc_service_method`;
CREATE TABLE `grpc_service_method` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `service_id` bigint(20) unsigned DEFAULT NULL,
  `name` longtext COLLATE utf8mb4_bin NOT NULL,
  `method_comment` longtext COLLATE utf8mb4_bin,
  `input_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `input_type` json NOT NULL,
  `output_type` json NOT NULL,
  `output_name` longtext COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `grpc_test_case`;
CREATE TABLE `grpc_test_case` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `method_id` bigint(20) unsigned DEFAULT NULL,
  `uid` bigint(20) unsigned DEFAULT NULL,
  `name` longtext COLLATE utf8mb4_bin,
  `input` longtext COLLATE utf8mb4_bin,
  `metadata` longtext COLLATE utf8mb4_bin,
  `script` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `grpc_test_log`;
CREATE TABLE `grpc_test_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `method_id` bigint(20) unsigned DEFAULT NULL,
  `operator_type` longtext COLLATE utf8mb4_bin,
  `operator_id` bigint(20) unsigned DEFAULT NULL,
  `input` longtext COLLATE utf8mb4_bin,
  `output` longtext COLLATE utf8mb4_bin,
  `status` varchar(20) COLLATE utf8mb4_bin DEFAULT NULL,
  `error` longtext COLLATE utf8mb4_bin,
  `time_cost` int(10) unsigned DEFAULT NULL,
  `addr` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `metadata` longtext COLLATE utf8mb4_bin,
  `script` longtext COLLATE utf8mb4_bin,
  `test_passed` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `http_test_case`;
CREATE TABLE `http_test_case` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `collection_id` bigint(20) unsigned DEFAULT NULL,
  `name` longtext COLLATE utf8mb4_bin,
  `url` longtext COLLATE utf8mb4_bin,
  `method` longtext COLLATE utf8mb4_bin,
  `query` json DEFAULT NULL,
  `headers` json DEFAULT NULL,
  `content_type` longtext COLLATE utf8mb4_bin,
  `body` longtext COLLATE utf8mb4_bin,
  `script` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `http_test_collection`;
CREATE TABLE `http_test_collection` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `app_name` longtext COLLATE utf8mb4_bin,
  `name` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `http_test_log`;
CREATE TABLE `http_test_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `operator_type` longtext COLLATE utf8mb4_bin,
  `operator_id` bigint(20) unsigned DEFAULT NULL,
  `app_name` longtext COLLATE utf8mb4_bin,
  `name` longtext COLLATE utf8mb4_bin,
  `url` longtext COLLATE utf8mb4_bin,
  `method` longtext COLLATE utf8mb4_bin,
  `query` json DEFAULT NULL,
  `headers` json DEFAULT NULL,
  `content_type` longtext COLLATE utf8mb4_bin,
  `body` longtext COLLATE utf8mb4_bin,
  `response_body` longtext COLLATE utf8mb4_bin,
  `response_headers` json DEFAULT NULL,
  `size` bigint(20) DEFAULT NULL,
  `cost` bigint(20) DEFAULT NULL,
  `code` bigint(20) DEFAULT NULL,
  `status` longtext COLLATE utf8mb4_bin,
  `error` longtext COLLATE utf8mb4_bin,
  `test_logs` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `k8s_pod`;
CREATE TABLE `k8s_pod` (
  `pod_name` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `env` longtext COLLATE utf8mb4_bin,
  `namespace` longtext COLLATE utf8mb4_bin,
  `host_ip` longtext COLLATE utf8mb4_bin,
  `pod_ip` longtext COLLATE utf8mb4_bin,
  `node_name` varchar(191) COLLATE utf8mb4_bin DEFAULT NULL,
  `start_time` datetime(3) DEFAULT NULL,
  `update_time` datetime(3) DEFAULT NULL,
  `image` longtext COLLATE utf8mb4_bin,
  `status` longtext COLLATE utf8mb4_bin,
  `instance_group_id` longtext COLLATE utf8mb4_bin,
  `instance_group_name` longtext COLLATE utf8mb4_bin,
  `md5` varchar(191) COLLATE utf8mb4_bin DEFAULT NULL,
  `is_del` int(11) DEFAULT NULL,
  `aid` int(11) DEFAULT NULL,
  `app_name` varchar(191) COLLATE utf8mb4_bin DEFAULT NULL,
  `zone_code` longtext COLLATE utf8mb4_bin,
  `domain` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`pod_name`),
  KEY `idx_md5` (`md5`),
  KEY `idx_aid` (`aid`),
  KEY `idx_appname` (`app_name`),
  KEY `idx_node_name` (`node_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `log_store`;
CREATE TABLE `log_store` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` longtext COLLATE utf8mb4_bin NOT NULL,
  `active_key` longtext COLLATE utf8mb4_bin NOT NULL,
  `app_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `env` longtext COLLATE utf8mb4_bin NOT NULL,
  `region` longtext COLLATE utf8mb4_bin,
  `project` longtext COLLATE utf8mb4_bin NOT NULL,
  `log_store` longtext COLLATE utf8mb4_bin NOT NULL,
  `remark` longtext COLLATE utf8mb4_bin NOT NULL,
  `ctime` bigint(20) NOT NULL DEFAULT '0',
  `utime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `node`;
CREATE TABLE `node` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `host_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `ip` longtext COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) NOT NULL,
  `update_time` bigint(20) NOT NULL,
  `env` longtext COLLATE utf8mb4_bin NOT NULL,
  `region_code` longtext COLLATE utf8mb4_bin NOT NULL,
  `region_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `zone_code` longtext COLLATE utf8mb4_bin NOT NULL,
  `zone_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `agent_heartbeat_time` bigint(20) NOT NULL,
  `proxy_heartbeat_time` bigint(20) NOT NULL,
  `node_type` bigint(20) NOT NULL,
  `agent_type` bigint(20) NOT NULL,
  `agent_version` longtext COLLATE utf8mb4_bin NOT NULL,
  `proxy_type` bigint(20) NOT NULL,
  `proxy_version` longtext COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `ops_supervisor_config`;
CREATE TABLE `ops_supervisor_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `aid` bigint(20) DEFAULT NULL,
  `app_name` longtext COLLATE utf8mb4_bin,
  `ops_app_name` longtext COLLATE utf8mb4_bin,
  `zone_code` longtext COLLATE utf8mb4_bin,
  `access_key` longtext COLLATE utf8mb4_bin,
  `access_secret` longtext COLLATE utf8mb4_bin,
  `create_time` bigint(20) DEFAULT NULL,
  `update_time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `option`;
CREATE TABLE `option` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `option_title` longtext COLLATE utf8mb4_bin NOT NULL,
  `option_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `option_value` longtext COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) NOT NULL COMMENT '''创建时间''',
  `update_time` bigint(20) NOT NULL COMMENT '''更新时间''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `pprof`;
CREATE TABLE `pprof` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` longtext COLLATE utf8mb4_bin NOT NULL,
  `scene_id` longtext COLLATE utf8mb4_bin NOT NULL,
  `app_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `aid` bigint(20) NOT NULL,
  `file_info` longtext COLLATE utf8mb4_bin NOT NULL,
  `zone_code` longtext COLLATE utf8mb4_bin NOT NULL,
  `env` longtext COLLATE utf8mb4_bin NOT NULL,
  `ext` longtext COLLATE utf8mb4_bin NOT NULL,
  `remark` longtext COLLATE utf8mb4_bin NOT NULL,
  `host_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) DEFAULT NULL,
  `update_time` bigint(20) DEFAULT NULL,
  `delete_time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pprof_delete_time` (`delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `proxy_manage`;
CREATE TABLE `proxy_manage` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` longtext COLLATE utf8mb4_bin NOT NULL,
  `sub_path` longtext COLLATE utf8mb4_bin NOT NULL,
  `is_rewrite` bigint(20) NOT NULL DEFAULT '0',
  `proxy_addr` longtext COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) NOT NULL DEFAULT '0',
  `update_time` bigint(20) NOT NULL DEFAULT '0',
  `delete_time` bigint(20) NOT NULL DEFAULT '0',
  `uid` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `proxy_manage` (`id`, `title`, `sub_path`, `is_rewrite`, `proxy_addr`, `create_time`, `update_time`, `delete_time`, `uid`) VALUES
(1,	'线下pyroscope',	'pyroscope',	1,	'http://pyroscope:4040',	1676948199,	1676948199,	0,	1),
(2,	'jaeger',	'jaeger',	0,	'http://jaeger:16686',	1676949341,	1676949341,	0,	1);

DROP TABLE IF EXISTS `proxy_menu`;
CREATE TABLE `proxy_menu` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `panel_type` longtext COLLATE utf8mb4_bin NOT NULL,
  `proxy_url` longtext COLLATE utf8mb4_bin NOT NULL,
  `key` longtext COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) NOT NULL DEFAULT '0',
  `update_time` bigint(20) NOT NULL DEFAULT '0',
  `delete_time` bigint(20) NOT NULL DEFAULT '0',
  `uid` bigint(20) NOT NULL DEFAULT '0',
  `title` longtext COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `proxy_menu` (`id`, `panel_type`, `proxy_url`, `key`, `create_time`, `update_time`, `delete_time`, `uid`, `title`) VALUES
(1,	'pyroscope',	'/proxy/pyroscope/',	'pyroscope.pre.wh',	1676948230,	1676948265,	0,	1,	'光谷F1(pre) pyroscope'),
(2,	'grafana',	'/proxy/jaeger',	'jaeger',	1676949390,	1676949739,	0,	1,	'光谷F1（pre) 链路追踪');

DROP TABLE IF EXISTS `system_config`;
CREATE TABLE `system_config` (
  `name` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `content` longtext COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) NOT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `system_config` (`name`, `content`, `create_time`, `update_time`) VALUES
('etcd',	'[{\"prefix\":\"/prometheus/job/\",\"info\":\"监控查询\"},{\"prefix\":\"grpc:\",\"info\":\"grpc\"},{\"prefix\":\"http:\",\"info\":\"http\"},{\"prefix\":\"/juno-agent/cluster/\",\"info\":\"配置\"}]',	1673061016,	1677139191),
('grafana',	'{\"host\":\"grafana:3000\",\"scheme\":\"http\",\"header_name\":\"X-WEBAUTH-USER\"}',	1673061016,	1676546139),
('k8s_cluster',	'{\"list\":[{\"name\":\"开发测试集群\",\"env\":[\"dev\"],\"zone_code\":\"cn-wuhan-guanggu-f1\",\"zone_name\":\"武汉光谷F1区\",\"domain\":\"incluster\",\"token\":\"incluster\"}]}',	1676627218,	0),
('version',	'[{\"name\":\"jupiter1.0\",\"version\":\"v1.0\",\"versionKey\":\"jupiter1.0\",\"dashboards\":[{\"name\":\"接口维度\",\"value\":\"/grafana/d/api/jie-kou-wei-du?orgId=1\"},{\"name\":\"实例维度\",\"value\":\"/grafana/d/instance/shi-li-wei-du?orgId=1\"},{\"name\":\"应用概览\",\"value\":\"/grafana/d/overview/ying-yong-gai-lan?orgId=1\"},{\"value\":\"/grafana/d/clientgrpc/ke-hu-duan-http-grpc?orgId=1\",\"name\":\"客户端HTTP/GRPC\"},{\"name\":\"客户端MySQL\",\"value\":\"/grafana/d/clientmysql/ke-hu-duan-mysql?orgId=1\"},{\"value\":\"grafana/d/clientredis/ke-hu-duan-redis?orgId=1\",\"name\":\"客户端Redis\"},{\"name\":\"客户端定时任务\",\"value\":\"/grafana/d/clientcron/ding-shi-ren-wu?orgId=1\"},{\"value\":\"/grafana/d/clientrocketmq/ke-hu-duan-rocketmq?orgId=1\",\"name\":\"客户端RocketMQ\"},{\"value\":\"/grafana/d/clientfreecache/ke-hu-duan-freecache?orgId=1\",\"name\":\"客户端FreeCache\"},{\"name\":\"熔断降级\",\"value\":\"/grafana/d/clientsentinel/sentinelrong-duan-jiang-ji?orgId=1\"},{\"name\":\"自定义\",\"value\":\"/grafana/d/customize/zi-ding-yi?orgId=1\"},{\"value\":\"grafana/d/pyroscope/pyroscope?orgId=1&var-appname=#APP_NAME&var-env=#ENV&var-pydatasource=#DATASOURCE.pyroscope&var-datasource=#DATASOURCE&var-aid=#AID&from=now-30m&to=now\",\"name\":\"Profile\"}]}]',	1673061016,	1677049009);

DROP TABLE IF EXISTS `test_pipeline`;
CREATE TABLE `test_pipeline` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext COLLATE utf8mb4_bin,
  `app_name` longtext COLLATE utf8mb4_bin,
  `env` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `zone_code` longtext COLLATE utf8mb4_bin,
  `branch` longtext COLLATE utf8mb4_bin,
  `code_check` tinyint(1) DEFAULT NULL,
  `unit_test` tinyint(1) DEFAULT NULL,
  `http_test_collection` bigint(20) DEFAULT NULL,
  `grpc_test_addr` longtext COLLATE utf8mb4_bin,
  `grpc_test_cases` json DEFAULT NULL,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `test_pipeline_step_status`;
CREATE TABLE `test_pipeline_step_status` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `task_id` bigint(20) unsigned DEFAULT NULL,
  `step_name` longtext COLLATE utf8mb4_bin,
  `status` longtext COLLATE utf8mb4_bin,
  `logs` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `test_pipeline_task`;
CREATE TABLE `test_pipeline_task` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `pipeline_id` bigint(20) unsigned DEFAULT NULL,
  `name` longtext COLLATE utf8mb4_bin,
  `app_name` longtext COLLATE utf8mb4_bin,
  `branch` longtext COLLATE utf8mb4_bin,
  `env` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `zone_code` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `desc` json DEFAULT NULL,
  `status` longtext COLLATE utf8mb4_bin,
  `logs` longtext COLLATE utf8mb4_bin,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `tool`;
CREATE TABLE `tool` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '''id''',
  `name` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''工具名''',
  `url` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''工具地址''',
  `pic_url` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''图片地址''',
  `desc` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''工具描述''',
  `create_time` bigint(20) NOT NULL COMMENT '''创建时间''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `oaid` bigint(20) NOT NULL COMMENT '''oa uid''',
  `username` varchar(100) COLLATE utf8mb4_bin NOT NULL COMMENT '''用户名''',
  `nickname` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''昵称''',
  `secret` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''秘钥''',
  `email` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''email''',
  `avatar` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''avatart''',
  `web_url` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''注释''',
  `state` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''注释''',
  `hash` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''注释''',
  `create_time` bigint(20) NOT NULL COMMENT '''注释''',
  `update_time` bigint(20) NOT NULL COMMENT '''注释''',
  `oauth` longtext COLLATE utf8mb4_bin NOT NULL,
  `oauth_id` longtext COLLATE utf8mb4_bin NOT NULL,
  `password` longtext COLLATE utf8mb4_bin NOT NULL COMMENT '''注释''',
  `current_authority` longtext COLLATE utf8mb4_bin,
  `access` longtext COLLATE utf8mb4_bin,
  `oauth_token` json DEFAULT NULL COMMENT '''OAuth Token 信息''',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `user` (`uid`, `oaid`, `username`, `nickname`, `secret`, `email`, `avatar`, `web_url`, `state`, `hash`, `create_time`, `update_time`, `oauth`, `oauth_id`, `password`, `current_authority`, `access`, `oauth_token`) VALUES
(1,	0,	'admin',	'admin',	'',	'',	'',	'',	'',	'',	1673061235,	1673061235,	'',	'',	'$2a$10$r9DQ07wk24/Pzkf99OR2huTT/4SbJp.pckSvQMl7bC7OXgOn1NZRi',	'',	'admin',	'{}'),
(2,	0,	'default',	'default',	'',	'',	'',	'',	'',	'',	1673061235,	1673061235,	'',	'',	'$2a$10$8H/zMx1BGrOIoPv0gnreu.s1i0zK8pGicyFXANbpXCYHOTQ9Y160O',	'',	'user',	'{}');

DROP TABLE IF EXISTS `user_config`;
CREATE TABLE `user_config` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL COMMENT '''用户id''',
  `aid` bigint(20) NOT NULL COMMENT '''应用id''',
  `content` longtext COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) NOT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `user_config` (`id`, `uid`, `aid`, `content`, `create_time`, `update_time`) VALUES
(1,	1,	1,	'{\"versionKey\":\"jupiter1.0\",\"dashboardPath\":\"/grafana/d/clientsentinel/sentinelrong-duan-jiang-ji?orgId=1\"}',	1675834945,	1677025859),
(2,	1,	2,	'{\"versionKey\":\"jupiter1.0\",\"dashboardPath\":\"grafana/d/pyroscope/pyroscope?orgId=1\\u0026var-appname=#APP_NAME\\u0026var-env=#ENV\\u0026var-pydatasource=#DATASOURCE.pyroscope\\u0026var-datasource=#DATASOURCE\\u0026var-aid=#AID\\u0026from=now-30m\\u0026to=now\"}',	1675836450,	1677049198),
(3,	1,	3,	'{\"versionKey\":\"jupiter1.0\",\"dashboardPath\":\"/grafana/d/clientcron/ding-shi-ren-wu?orgId=1\"}',	1677029403,	1677049192);

DROP TABLE IF EXISTS `user_relation`;
CREATE TABLE `user_relation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '''注释''',
  `uid` bigint(20) NOT NULL COMMENT '''注释''',
  `bid` bigint(20) NOT NULL COMMENT '''注释''',
  `type` bigint(20) NOT NULL COMMENT '''注释''',
  `create_time` bigint(20) NOT NULL COMMENT '''注释''',
  `update_time` bigint(20) NOT NULL COMMENT '''注释''',
  `delete_time` bigint(20) NOT NULL COMMENT '''注释''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `user_visit`;
CREATE TABLE `user_visit` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL COMMENT '''用户id''',
  `aid` bigint(20) NOT NULL COMMENT '''应用id''',
  `app_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `zone_code` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `env` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `tab` longtext COLLATE utf8mb4_bin NOT NULL,
  `url` longtext COLLATE utf8mb4_bin NOT NULL,
  `ts` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_env` (`env`),
  KEY `tx` (`ts`),
  KEY `idx_uid` (`uid`),
  KEY `idx_aid` (`aid`),
  KEY `idx_zone_code` (`zone_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `worker_node`;
CREATE TABLE `worker_node` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `host_name` longtext COLLATE utf8mb4_bin,
  `region_code` longtext COLLATE utf8mb4_bin,
  `region_name` longtext COLLATE utf8mb4_bin,
  `zone_code` longtext COLLATE utf8mb4_bin,
  `zone_name` longtext COLLATE utf8mb4_bin,
  `ip` longtext COLLATE utf8mb4_bin,
  `port` bigint(20) DEFAULT NULL,
  `env` longtext COLLATE utf8mb4_bin,
  `last_heartbeat` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `zone`;
CREATE TABLE `zone` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '''注释''',
  `env` longtext COLLATE utf8mb4_bin NOT NULL,
  `region_code` longtext COLLATE utf8mb4_bin NOT NULL,
  `region_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `zone_code` varchar(191) COLLATE utf8mb4_bin NOT NULL,
  `zone_name` longtext COLLATE utf8mb4_bin NOT NULL,
  `create_time` bigint(20) NOT NULL COMMENT '''注释''',
  `update_time` bigint(20) NOT NULL COMMENT '''注释''',
  `created_by` bigint(20) NOT NULL COMMENT '''注释''',
  `updated_by` bigint(20) NOT NULL COMMENT '''注释''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `zone` (`id`, `env`, `region_code`, `region_name`, `zone_code`, `zone_name`, `create_time`, `update_time`, `created_by`, `updated_by`) VALUES
(1,	'dev',	'cn-wuhan',	'武汉',	'cn-wuhan-guanggu-f1',	'武汉光谷F1区',	1677051308,	1677051308,	0,	0);

-- 2023-02-22 07:35:39