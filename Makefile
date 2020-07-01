
.DEFAULT_GOAL := default
.PHONY: run run.grpc run.npm run.p database sync.app sync.pkg sync.cmc

BASE_PATH:=$(shell dirname $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST)))))
BUILD_PATH:=$(BASE_PATH)/juno/build

########################################################
database.install:
	@go run cmd/install/main.go --config=configs/install.toml
database.clear:
	@go run cmd/install/main.go --config=configs/install.toml --clear=true
database.mock:
	@go run cmd/install/main.go --config=configs/install.toml --mock=true
database.debug: database.clear database.install database.mock

run.single-region-admin:
	@go run cmd/admin/main.go --config=configs/single-region-admin.toml

run.multiple-region-admin:
	@go run cmd/admin/main.go --config=configs/multiple-region-admin.toml
run.multiple-region-proxy:
	@go run cmd/proxy/main.go --config=configs/multiple-region-proxy.toml

docker:
	@docker-compose -f ./build/docker/standalone.yaml up

docker.build.run:
	@./docker/run.sh


