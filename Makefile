
.DEFAULT_GOAL := default
.PHONY: run run.grpc run.npm run.p database sync.app sync.pkg sync.cmc

BASE_PATH:=$(shell dirname $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST)))))
BUILD_PATH:=$(BASE_PATH)/juno/build

########################################################
install:
	@go run cmd/install/main.go --config=configs/install.toml

run:
	@go run cmd/admin/main.go --config=configs/admin.toml

docker:
	@docker-compose -f ./build/docker/standalone.yaml up

docker.build.run:
	@./docker/run.sh


